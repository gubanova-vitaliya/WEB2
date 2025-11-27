import React from 'react'
import {delSumAction, setSumAction, useData, useSum} from "../store/slices/dataSlice";
import '../styles.css'
import {useDispatch} from "react-redux";
import {GetData} from "../getData";

export default function ShoppingCart(){
    const dispatch = useDispatch()
    GetData()  // вызов хука
    const sum = useSum()
    const data = useData()
    return(
        <div className="shopping-cart">
            <div className="large"> Сумма заказа: { sum }</div>
            {
                data.map((good) =>
                    <div key={good.id} className="product-item">
                        <p>
                        { good.title }
                        </p>
                        <p> Цена -
                            { good.price }
                        </p>
                        <button onClick={ () => {
                            dispatch(setSumAction( good.price ))
                            }}>
                            Добавить
                        </button>
                    </div>
                )
            }
            <button onClick={() => {
                dispatch(delSumAction())
            }
            }>
                Обнулить
            </button>
        </div>
    )
}
