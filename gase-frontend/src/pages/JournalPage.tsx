import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import { AppDispatch, RootState } from "../store";
import { getDraftCalculationAsync, calculateFinalPressure, markCalculationAsFormed, markCalculationAsDeleted, getMyCalculationsAsync } from "../slices/calculationSlice";
import { ROUTES } from "../Routes";
import "./JournalPage.css";

const JournalPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { gases, loading, error, app_id } = useSelector((state: RootState) => state.calculation);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Локальное состояние для параметров каждого газа (ключ - gasCalcId)
  const [gasParams, setGasParams] = useState<Record<number, {
    initial_pressure: number | null;
    initial_temperature: number | null;
    final_temperature: number | null;
    volume: number | null;
    gas_amount: number | null;
  }>>({});

  // Загружаем данные черновика
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDraftCalculationAsync());
    }
  }, [dispatch, isAuthenticated]);

  // Инициализируем параметры из загруженных данных
  useEffect(() => {
    if (gases && gases.length > 0) {
      const params: Record<number, any> = {};
      gases.forEach((gas) => {
        if (gas.id) {
          params[gas.id] = {
            initial_pressure: gas.initial_pressure ?? null,
            initial_temperature: gas.initial_temperature ?? null,
            final_temperature: gas.final_temperature ?? null,
            volume: gas.final_volume ?? gas.initial_volume ?? null,
            gas_amount: gas.quantity ?? null,
          };
        }
      });
      setGasParams(params);
    }
  }, [gases]);

  // Редирект если не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Обработчик изменения параметров
  const handleParamChange = (gasCalcId: number, gasId: number, paramName: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setGasParams((prev) => ({
      ...prev,
      [gasCalcId]: {
        ...prev[gasCalcId],
        [paramName]: numValue,
      },
    }));

    // Автосохранение параметра через API (если нужно)
    // В бэкенде это делается через POST /calculation/:id/update
    // Здесь мы только обновляем локальное состояние
  };

  // Обработчик расчета для одного газа
  const handleCalculate = async (gasCalcId: number, gasId: number) => {
    const params = gasParams[gasCalcId];
    if (params && params.initial_pressure !== null && params.initial_temperature !== null && 
        params.final_temperature !== null && params.volume !== null && app_id) {
      // Используем формулу идеального газа: P2 = P1 * V1 * T2 / (V2 * T1)
      // Для журнала расчетов используем тот же объем как начальный и конечный
      // gasCalcId - это ID из GasCalculation, который нужно передать в gasId параметр
      await dispatch(calculateFinalPressure({
        appId: app_id,
        gasId: gasCalcId, // Используем gasCalcId, так как это ID GasCalculation
        initial_pressure: params.initial_pressure,
        initial_volume: params.volume,
        initial_temperature: params.initial_temperature,
        final_volume: params.volume,
        final_temperature: params.final_temperature,
      }));
      // Перезагружаем данные после расчета
      dispatch(getDraftCalculationAsync());
    }
  };

  // Обработчик формирования заявки (изменение статуса на "Сформирована")
  const handleFormCalculation = async () => {
    if (app_id) {
      const result = await dispatch(markCalculationAsFormed(app_id.toString()));
      if (markCalculationAsFormed.fulfilled.match(result)) {
        // Перезагружаем данные после изменения статуса
        dispatch(getDraftCalculationAsync());
        // Обновляем список заявок на странице "Мои заявки"
        dispatch(getMyCalculationsAsync());
      }
    }
  };

  // Обработчик удаления заявки (изменение статуса на "Удалена")
  const handleDeleteCalculation = async () => {
    if (app_id) {
      const result = await dispatch(markCalculationAsDeleted(app_id.toString()));
      if (markCalculationAsDeleted.fulfilled.match(result)) {
        // Перезагружаем данные после изменения статуса
        dispatch(getDraftCalculationAsync());
        // Обновляем список заявок на странице "Мои заявки"
        dispatch(getMyCalculationsAsync());
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="journal-container">
      <div className="journal-header">
        <h1>🧪 Журнал расчетов</h1>
        <p className="journal-subtitle">Заполните параметры и нажмите кнопки для расчетов</p>
      </div>

      {error && (
        <Alert variant="danger" className="error-alert">
          ❌ {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && gases && gases.length > 0 ? (
        <div className="calculations-list">
          {gases.map((item, index) => {
            // Используем position из базы данных для нумерации по порядку добавления
            const orderNumber = item.position || item.order_number || index + 1;
            const gasCalcId = item.id || 0; // ID из GasCalculation
            const gasId = item.gas?.id || 0; // ID самого газа
            const params = gasParams[gasCalcId] || {};
            const canCalculate = params.initial_pressure !== null && 
                                params.initial_temperature !== null && 
                                params.final_temperature !== null && 
                                params.volume !== null;

            return (
              <Card key={gasCalcId} className="gas-calculation-card">
                <Card.Body>
                  {/* Заголовок газа */}
                  <div className="gas-header">
                    <div>
                      <span className="gas-number">#{orderNumber}</span>
                      <span className="gas-title">{item.gas?.title || 'Неизвестный газ'}</span>
                      <span className="gas-formula"> ({item.gas?.formula || '-'})</span>
                    </div>
                    <div className="gas-molar-mass">
                      {item.gas?.molar_mass?.toFixed(2) || '-'} г/моль
                    </div>
                  </div>

                  {/* Форма расчета */}
                  <div className="parameters-grid">
                    <div className="param-group">
                      <label>Нач. давление (атм)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="1.0"
                        value={params.initial_pressure ?? ''}
                        className="param-input"
                        onChange={(e) => handleParamChange(gasCalcId, gasId, 'initial_pressure', e.target.value)}
                      />
                    </div>

                    <div className="param-group">
                      <label>Нач. темп. (К)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="273.15"
                        value={params.initial_temperature ?? ''}
                        className="param-input"
                        onChange={(e) => handleParamChange(gasCalcId, gasId, 'initial_temperature', e.target.value)}
                      />
                    </div>

                    <div className="param-group">
                      <label>Кон. темп. (К)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="373.15"
                        value={params.final_temperature ?? ''}
                        className="param-input"
                        onChange={(e) => handleParamChange(gasCalcId, gasId, 'final_temperature', e.target.value)}
                      />
                    </div>

                    <div className="param-group">
                      <label>Объем (м³)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="0.001"
                        value={params.volume ?? ''}
                        className="param-input"
                        onChange={(e) => handleParamChange(gasCalcId, gasId, 'volume', e.target.value)}
                      />
                    </div>

                    <div className="param-group">
                      <label>Кол-во в-ва (моль)</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="0.1"
                        value={params.gas_amount ?? ''}
                        className="param-input"
                        onChange={(e) => handleParamChange(gasCalcId, gasId, 'gas_amount', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Кнопки действий и результат */}
                  <div className="action-buttons">
                    <Button
                      variant="success"
                      className="calculate-gas-btn"
                      onClick={() => handleCalculate(gasCalcId, gasId)}
                      disabled={!canCalculate}
                    >
                      ⚡ Рассчитать
                    </Button>

                    <div className="result-display">
                      {item.final_pressure !== null &&
                        item.final_pressure !== undefined &&
                        !isNaN(Number(item.final_pressure)) ? (
                          <span className="final-pressure-value">
                            {Number(item.final_pressure).toFixed(4)} атм
                          </span>
                        ) : (
                          <span className="not-calculated">Не рассчитано</span>
                        )}
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="action-buttons mt-3" style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                    <Button
                      variant="success"
                      className="form-calculation-btn"
                      onClick={handleFormCalculation}
                    >
                      ✅ Сформировать
                    </Button>
                    <Button
                      variant="warning"
                      className="delete-calculation-btn"
                      onClick={handleDeleteCalculation}
                    >
                      🗑️ Удалить расчет
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      ) : !loading ? (
        <div className="empty-journal">
          <div className="empty-icon">📝</div>
          <h3>Журнал расчетов пуст</h3>
          <p>Добавьте газы из каталога для начала расчетов</p>
        </div>
      ) : null}
    </Container>
  );
};

export default JournalPage;

