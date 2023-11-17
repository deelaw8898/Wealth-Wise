import { render, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';

describe('Calculator Component Tests', () => {
    let getByText, getByTestId, display;

    // Helper function to perform calculation
    const performCalculation = (sequence) => {
        sequence.forEach(btn => fireEvent.click(getByText(btn)));
        display = getByTestId('calculator-display');
    }

    beforeEach(() => {
        ({ getByText, getByTestId } = render(<Calculator />));
    });

    test('TC01 - Addition Operation', () => {
        performCalculation(['2', '+', '3', '=']);
        expect(display.value).toBe('5');
    });

    test('TC02 - Addition Operation', () => {
        performCalculation(['2', '+', '3', '+', '5', '=']);
        expect(display.value).toBe('10');
    });

    test('TC03 - Addition Operation', () => {
        performCalculation(['2','.','1', '+', '3','.','1', '=']);
        expect(display.value).toBe('5.2');
    });


    test('TC04 - Subtraction Operation', () => {
        performCalculation(['5', '\u2013', '2', '=']);
        expect(display.value).toBe('3');
    });

    test('TC05 - Subtraction Operation', () => {
        performCalculation(['5', '\u2013', '3', '\u2013', '1', '=']);
        expect(display.value).toBe('1');
    });

    test('TC06 - Subtraction Operation', () => {
        performCalculation(['3','.','1', '\u2013', '2','.','1', '=']);
        expect(display.value).toBe('1');
    });

    // Multiplication Tests
    test('TC07 - Multiplication Operation', () => {
        performCalculation(['3', '\u00D7', '4', '=']);
        expect(display.value).toBe('12');
    });

    test('TC08 - Multiplication Operation with Decimals', () => {
        performCalculation(['1', '.', '5', '\u00D7', '2', '=']);
        expect(display.value).toBe('3');
    });

    test('TC09 - Multiplication with Multiple Numbers', () => {
        performCalculation(['2', '\u00D7', '3', '\u00D7', '4', '=']);
        expect(display.value).toBe('24');
    });

// Division Tests
    test('TC10 - Division Operation', () => {
        performCalculation(['8', '\u00F7', '2', '=']);
        expect(display.value).toBe('4');
    });

    test('TC11 - Division Operation with Decimals', () => {
        performCalculation(['5', '\u00F7', '2', '=']);
        expect(display.value).toBe('2.5');
    });

    test('TC12 - Complex Division Operation', () => {
        performCalculation(['9', '\u00F7', '4', '\u00F7', '2', '=']);
        expect(display.value).toBe('1.125');
    });

// Additional Functionality Tests
    test('TC13 - Backspace Operation', () => {
        performCalculation(['1', '2', '3', '4', 'DE', 'DE', '=']);
        expect(display.value).toBe('12');
    });

    test('TC14 - Complex Operation with All Operators', () => {
        performCalculation(['9', '+', '1', '\u00D7', '2', '\u2013', '3', '\u00F7', '4', '=']);
        expect(display.value).toBe('10.25'); // to check that the calculator handles order of operations correctly
    });


});

