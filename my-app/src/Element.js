import "./App.css";
import styles from './index.css';

export function Element( props)
{
    const numbers = props.buyer;

    const items = numbers.map((item, index) => {
       return <li key={index.toString()}> Buyer Address: {item} </li>
    })
    return(
        <>
            <ol > {items} </ol>
        </>
    )
}