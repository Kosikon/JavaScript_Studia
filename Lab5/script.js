// Asynchroniczna funkcja dodająca dwie liczby
const asyncAdd = (a, b) => {
    return new Promise((resolve, reject) => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            reject('Argumenty muszą mieć typ number!');
        } else {
            setTimeout(() => {
                resolve(a + b);
            }, 100);
        }
    });
};

// Funkcja dodająca dowolną ilość liczb asynchronicznie
const sumAsyncNumbers = async (...numbers) => {
    let result = 0;
    for (const number of numbers) {
        result = await asyncAdd(result, number);
    }
    return result;
};

// Funkcja mierząca czas wykonania operacji
const measureTime = async (operation, ...args) => {
    const start = performance.now();
    await operation(...args);
    const end = performance.now();
    return end - start;
};

// Obsługa przycisku i rozpoczęcie testu
document.getElementById('startButton').addEventListener('click', async () => {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1); // Liczby od 1 do 100
    const timeTaken = await measureTime(sumAsyncNumbers, ...numbers);
    const resultElement = document.getElementById('result');
    resultElement.textContent = `Czas wykonania: ${timeTaken.toFixed(2)}ms, Ilość operacji: ${numbers.length}`;
});
