import { Gas } from "../components/GasCard";
import { getDestRoot } from "../../target_config";

const createGasesMock = (): Gas[] => {
  const destRoot = getDestRoot();
  
  // Вспомогательная функция для правильного формирования путей
  const getImagePath = (imageName: string) => {
    let path: string;
    if (destRoot === '') {
      path = '/' + imageName;
    } else {
      const base = destRoot.endsWith('/') ? destRoot : destRoot + '/';
      path = base + imageName;
    }
    // Логируем путь для отладки (только в development)
    if (import.meta.env.DEV) {
      console.log(`Image path for ${imageName}:`, path);
    }
    return path;
  };
  
  return [
    {
      id: 1,
      title: "Водород",
      formula: "H₂",
      molar_mass: 2.016,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Самый легкий химический элемент, бесцветный газ без запаха и вкуса.",
    },
    {
      id: 2,
      title: "Кислород",
      formula: "O₂",
      molar_mass: 32.0,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Жизненно важный газ, необходимый для дыхания большинства живых организмов.",
    },
    {
      id: 3,
      title: "Азот",
      formula: "N₂",
      molar_mass: 28.014,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Инертный газ, составляющий основную часть атмосферы Земли.",
    },
    {
      id: 4,
      title: "Углекислый газ",
      formula: "CO₂",
      molar_mass: 44.01,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Газ, образующийся при дыхании и сжигании органических веществ.",
    },
    {
      id: 5,
      title: "Метан",
      formula: "CH₄",
      molar_mass: 16.043,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Основной компонент природного газа, простейший углеводород.",
    },
    {
      id: 6,
      title: "Гелий",
      formula: "He",
      molar_mass: 4.003,
      image_url: getImagePath('gas-image/i.webp'),
      description: "Инертный газ, второй по легкости элемент, используется в воздушных шарах.",
    },
  ];
};

export const GASES_MOCK: Gas[] = createGasesMock();
