import {useState} from "react";
import Button from "../../components/Button.jsx";

function CounterPage() {

    const [count, setCount] = useState(0);

    return (
        <div id="counter-container" className="flex flex-col items-center m-10 gap-1">
            <h2>Dette er en lille counter!</h2>
            <p>count: {count}</p>
            <div id="button-container" className="flex gap-2">
                <Button onClick={handleIncrement} text="Increment"/>
                <Button onClick={handleDecrement} text="Decrement"/>
            </div>
        </div>
    );

    function handleIncrement() {
        setCount(prevState => prevState + 1);
    }

    function handleDecrement() {
        setCount(prevState => Math.max(prevState - 1, 0));
    }
}

export default CounterPage;