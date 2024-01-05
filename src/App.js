import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';
import './App.css';
import logo from './logo.svg';

function Calculator() {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const calculator = document.querySelector('#calculator');
    const children = calculator.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.gridArea = children[i].id;
    }
  }, []);

  const handleClick = (e) => {
    const value = e.target.value;

    // Handle decimal point
    if (value === ".") {
      const numbers = displayValue.split(/[\+\-\*\/]/);
      const currentNumber = numbers[numbers.length - 1];
      if (currentNumber.includes(".")) {
        return; // Do not append "." if it already exists in the current number
      }
    }

    setDisplayValue((prevValue) => {
      // Handle zero
      if (prevValue === "0" && value !== ".") {
        return value;
      }
      // Handle operators
      else if (["+", "*", "/"].includes(value)) {
        if (["+", "-", "*", "/"].includes(prevValue.slice(-1))) {
          return prevValue.slice(0, -1) + value; // Replace the last operator with the new one
        }
      }
      else if (value === "-") {
        if (["*", "/"].includes(prevValue.slice(-1))) {
          return prevValue + value; // Append the negative sign if the last operator is "*" or "/"
        } else if (["+", "-"].includes(prevValue.slice(-1))) {
          return prevValue.slice(0, -1) + value; // Replace the last operator with the new one if it's "+" or "-"
        }
      }
      // Default case
      return prevValue + value;
    });
  };

  const equalsClickHandler = (e) => {
    e.preventDefault();
    // Replace multiple consecutive operators (excluding the negative sign if it's the last character) with the last one
    const expression = displayValue.replace(/([\+\*\/])-?/g, "$1");
    // Evaluate the expression
    try {
      const result = math.evaluate(expression);
      setDisplayValue(String(result));
    } catch (error) {
      console.error("Error calculating result:", error);
    }
  };

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setDisplayValue((prevValue) => {
      const operands = prevValue.split(/[\+\-\*\/]/);
      const lastOperand = operands[operands.length - 1];
      if (!lastOperand.includes(".")) {
        return prevValue + value;
      } else {
        return prevValue;
      }
    });
  };

  const calculate = () => {
    try {
      // Replace multiple consecutive operators with the last operator entered
      const expression = displayValue.replace(/([\+\-\*\/]{2,})/g, (match) => {
        const lastChar = match.slice(-1);
        return lastChar === '-' ? match.slice(-2) : lastChar;
      });
      const result = math.evaluate(expression);
      setDisplayValue(result.toString());
    } catch (error) {
      console.error("Error calculating result:", error);
    }
  };

  const handleEqualsClick = (e) => {
    equalsClickHandler(e);
    calculate();
  };

  const clear = () => {
    setDisplayValue("0");
  };

  return (
    <div id="calculator">
      <div id="logoLeft"><img src="https://cdn.freecodecamp.org/platform/universal/fcc_primary.svg" alt="FreeCodeCamp logo" /></div>
      <div id="display">{displayValue}</div>
      <div id="logoRight"><img src={logo} className="App-logo" alt="logo" /></div>
      <button id="zero" value="0" onClick={handleClick}>0</button>
      <button id="one" value="1" onClick={handleClick}>1</button>
      <button id="two" value="2" onClick={handleClick}>2</button>
      <button id="three" value="3" onClick={handleClick}>3</button>
      <button id="four" value="4" onClick={handleClick}>4</button>
      <button id="five" value="5" onClick={handleClick}>5</button>
      <button id="six" value="6" onClick={handleClick}>6</button>
      <button id="seven" value="7" onClick={handleClick}>7</button>
      <button id="eight" value="8" onClick={handleClick}>8</button>
      <button id="nine" value="9" onClick={handleClick}>9</button>
      <button id="decimal" onClick={commaClickHandler}>.</button>
      <button id="add" value="+" onClick={handleClick}>+</button>
      <button id="subtract" value="-" onClick={handleClick}>-</button>
      <button id="multiply" value="*" onClick={handleClick}>*</button>
      <button id="divide" value="/" onClick={handleClick}>/</button>
      <button id="equals" onClick={handleEqualsClick}>=</button>
      <button id="clear" onClick={clear}>C</button>
    </div>
  );
}

export default Calculator;

