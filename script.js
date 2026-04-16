// Calculator State
let currentValue = '0';
let previousValue = '';
let operation = null;
let history = '';
let angleMode = 'deg'; // deg or rad
let memory = 0;
let waitingForOperand = false;

// Display Elements
const display = document.getElementById('display');
const historyDisplay = document.getElementById('history');

// Update display
function updateDisplay() {
    display.textContent = currentValue;
    historyDisplay.textContent = history;
}

// Clear display
function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operation = null;
    history = '';
    waitingForOperand = false;
    updateDisplay();
}

// Append number
function appendNumber(num) {
    if (waitingForOperand) {
        currentValue = num;
        waitingForOperand = false;
    } else {
        if (currentValue === '0' && num !== '.') {
            currentValue = num;
        } else {
            if (num === '.' && currentValue.includes('.')) return;
            currentValue += num;
        }
    }
    updateDisplay();
}

// Handle operators
function handleOperator(op) {
    if (operation !== null && !waitingForOperand) {
        calculate();
    }
    
    previousValue = currentValue;
    operation = op;
    history = `${currentValue} ${op}`;
    waitingForOperand = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operation === null || waitingForOperand) return;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    let result;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current !== 0 ? prev / current : 'Error';
            break;
        case '%':
            result = prev % current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    history = `${previousValue} ${operation} ${currentValue} =`;
    currentValue = result.toString();
    operation = null;
    previousValue = '';
    waitingForOperand = true;
    updateDisplay();
}

// Handle functions
function handleFunction(func) {
    const num = parseFloat(currentValue);
    let result;
    
    switch (func) {
        case 'sin':
            result = angleMode === 'deg' ? Math.sin(num * Math.PI / 180) : Math.sin(num);
            break;
        case 'cos':
            result = angleMode === 'deg' ? Math.cos(num * Math.PI / 180) : Math.cos(num);
            break;
        case 'tan':
            result = angleMode === 'deg' ? Math.tan(num * Math.PI / 180) : Math.tan(num);
            break;
        case 'ln':
            result = Math.log(num);
            break;
        case 'log':
            result = Math.log10(num);
            break;
        case 'sqrt':
            result = Math.sqrt(num);
            break;
        case 'square':
            result = num * num;
            break;
        case 'factorial':
            result = factorial(num);
            break;
        case 'pi':
            currentValue = Math.PI.toString();
            updateDisplay();
            return;
        case 'e':
            currentValue = Math.E.toString();
            updateDisplay();
            return;
        case 'inv':
            result = 1 / num;
            break;
        case 'deg':
            angleMode = angleMode === 'deg' ? 'rad' : 'deg';
            alert(`Mode sudut: ${angleMode.toUpperCase()}`);
            return;
        case 'power':
            handleOperator('^');
            return;
        case 'parenthesis':
            // Simplified parenthesis handling
            if (currentValue.includes('(') && !currentValue.includes(')')) {
                currentValue += ')';
            } else {
                currentValue += '(';
            }
            updateDisplay();
            return;
        case 'multiply':
            handleOperator('*');
            return;
        case 'divide':
            handleOperator('/');
            return;
        default:
            return;
    }
    
    history = `${func}(${currentValue}) =`;
    currentValue = result.toString();
    waitingForOperand = true;
    updateDisplay();
}

// Factorial function
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Memory functions
function toggleMemory() {
    memory = parseFloat(currentValue);
    alert(`Nilai ${memory} disimpan ke memori`);
}

// Mode Toggle
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const mode = this.dataset.mode;
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Toggle modes
        if (mode === 'calc') {
            document.getElementById('calcMode').classList.remove('hidden');
            document.getElementById('nlpMode').classList.add('hidden');
        } else {
            document.getElementById('calcMode').classList.add('hidden');
            document.getElementById('nlpMode').classList.remove('hidden');
        }
    });
});

// ==================== NLP SOLVER ====================

async function solveNLP() {
    const input = document.getElementById('nlpInput').value.trim();
    const resultDiv = document.getElementById('nlpResult');
    
    if (!input) {
        resultDiv.innerHTML = '<div class="error">Silakan masukkan soal cerita terlebih dahulu!</div>';
        return;
    }
    
    // Show loading
    resultDiv.innerHTML = '<div class="loading"></div>';
    
    try {
        // Parse the problem using NLP
        const analysis = await parseWordProblem(input);
        
        // Display result
        displayNLPResult(analysis, resultDiv);
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Terjadi kesalahan: ${error.message}</div>`;
    }
}

async function parseWordProblem(problem) {
    // Normalize text
    const text = problem.toLowerCase();
    
    // Extract numbers
    const numbers = extractNumbers(text);
    
    // Detect problem type
    const problemType = detectProblemType(text);
    
    // Solve based on type
    let solution;
    
    switch (problemType) {
        case 'jarak':
            solution = solveDistance(text, numbers);
            break;
        case 'total_harga':
            solution = solveTotalPrice(text, numbers);
            break;
        case 'luas_lingkaran':
            solution = solveCircleArea(text, numbers);
            break;
        case 'luas_persegi':
            solution = solveSquareArea(text, numbers);
            break;
        case 'keliling_persegi':
            solution = solveSquarePerimeter(text, numbers);
            break;
        case 'volume_kubus':
            solution = solveCubeVolume(text, numbers);
            break;
        case 'kecepatan':
            solution = solveSpeed(text, numbers);
            break;
        case 'persentase':
            solution = solvePercentage(text, numbers);
            break;
        case 'rata_rata':
            solution = solveAverage(text, numbers);
            break;
        case 'perbandingan':
            solution = solveRatio(text, numbers);
            break;
        default:
            solution = solveGeneral(text, numbers);
    }
    
    return {
        originalProblem: problem,
        problemType: problemType,
        extractedNumbers: numbers,
        solution: solution
    };
}

function extractNumbers(text) {
    // Extract all numbers including decimals and fractions
    const numberPattern = /(\d+[.,]\d+|\d+)/g;
    const matches = text.match(numberPattern);
    return matches ? matches.map(n => parseFloat(n.replace(',', '.'))) : [];
}

function detectProblemType(text) {
    // Jarak
    if ((text.includes('jarak') || text.includes('menempuh')) && 
        (text.includes('kecepatan') || text.includes('km') || text.includes('jam'))) {
        return 'jarak';
    }
    
    // Total harga
    if ((text.includes('total') || text.includes('membayar') || text.includes('harga')) && 
        (text.includes('kg') || text.includes('buah') || text.includes('item'))) {
        return 'total_harga';
    }
    
    // Luas lingkaran
    if (text.includes('luas') && text.includes('lingkaran')) {
        return 'luas_lingkaran';
    }
    
    // Luas persegi
    if (text.includes('luas') && (text.includes('persegi') || text.includes('bujur sangkar'))) {
        return 'luas_persegi';
    }
    
    // Keliling persegi
    if (text.includes('keliling') && text.includes('persegi')) {
        return 'keliling_persegi';
    }
    
    // Volume kubus
    if (text.includes('volume') && text.includes('kubus')) {
        return 'volume_kubus';
    }
    
    // Kecepatan
    if (text.includes('kecepatan') && !text.includes('jarak')) {
        return 'kecepatan';
    }
    
    // Persentase
    if (text.includes('persen') || text.includes('%') || text.includes('diskon')) {
        return 'persentase';
    }
    
    // Rata-rata
    if (text.includes('rata-rata') || text.includes('mean')) {
        return 'rata_rata';
    }
    
    // Perbandingan
    if (text.includes('perbandingan') || text.includes('rasio')) {
        return 'perbandingan';
    }
    
    return 'general';
}

function solveDistance(text, numbers) {
    // Rumus: Jarak = Kecepatan × Waktu
    const kecepatan = numbers[0];
    const waktu = numbers[1];
    const jarak = kecepatan * waktu;
    
    return {
        formula: 'Jarak = Kecepatan × Waktu',
        steps: [
            `Diketahui: Kecepatan = ${kecepatan} km/jam, Waktu = ${waktu} jam`,
            `Jarak = ${kecepatan} × ${waktu}`,
            `Jarak = ${jarak} km`
        ],
        answer: `${jarak} km`,
        calculation: `${kecepatan} × ${waktu} = ${jarak}`
    };
}

function solveTotalPrice(text, numbers) {
    const jumlah = numbers[0];
    const hargaSatuan = numbers[1];
    const total = jumlah * hargaSatuan;
    
    return {
        formula: 'Total = Jumlah × Harga Satuan',
        steps: [
            `Diketahui: Jumlah = ${jumlah}, Harga per unit = Rp ${hargaSatuan.toLocaleString('id-ID')}`,
            `Total = ${jumlah} × ${hargaSatuan}`,
            `Total = Rp ${total.toLocaleString('id-ID')}`
        ],
        answer: `Rp ${total.toLocaleString('id-ID')}`,
        calculation: `${jumlah} × ${hargaSatuan} = ${total}`
    };
}

function solveCircleArea(text, numbers) {
    const r = numbers[0];
    const luas = Math.PI * r * r;
    
    return {
        formula: 'Luas = π × r²',
        steps: [
            `Diketahui: Jari-jari (r) = ${r} cm`,
            `Luas = π × ${r}²`,
            `Luas = 3.14159 × ${r * r}`,
            `Luas ≈ ${luas.toFixed(2)} cm²`
        ],
        answer: `${luas.toFixed(2)} cm²`,
        calculation: `π × ${r}² = ${luas.toFixed(2)}`
    };
}

function solveSquareArea(text, numbers) {
    const sisi = numbers[0];
    const luas = sisi * sisi;
    
    return {
        formula: 'Luas = sisi × sisi',
        steps: [
            `Diketahui: Sisi = ${sisi} cm`,
            `Luas = ${sisi} × ${sisi}`,
            `Luas = ${luas} cm²`
        ],
        answer: `${luas} cm²`,
        calculation: `${sisi} × ${sisi} = ${luas}`
    };
}

function solveSquarePerimeter(text, numbers) {
    const sisi = numbers[0];
    const keliling = 4 * sisi;
    
    return {
        formula: 'Keliling = 4 × sisi',
        steps: [
            `Diketahui: Sisi = ${sisi} cm`,
            `Keliling = 4 × ${sisi}`,
            `Keliling = ${keliling} cm`
        ],
        answer: `${keliling} cm`,
        calculation: `4 × ${sisi} = ${keliling}`
    };
}

function solveCubeVolume(text, numbers) {
    const sisi = numbers[0];
    const volume = sisi * sisi * sisi;
    
    return {
        formula: 'Volume = sisi³',
        steps: [
            `Diketahui: Sisi = ${sisi} cm`,
            `Volume = ${sisi}³`,
            `Volume = ${sisi} × ${sisi} × ${sisi}`,
            `Volume = ${volume} cm³`
        ],
        answer: `${volume} cm³`,
        calculation: `${sisi}³ = ${volume}`
    };
}

function solveSpeed(text, numbers) {
    const jarak = numbers[0];
    const waktu = numbers[1];
    const kecepatan = jarak / waktu;
    
    return {
        formula: 'Kecepatan = Jarak ÷ Waktu',
        steps: [
            `Diketahui: Jarak = ${jarak} km, Waktu = ${waktu} jam`,
            `Kecepatan = ${jarak} ÷ ${waktu}`,
            `Kecepatan = ${kecepatan.toFixed(2)} km/jam`
        ],
        answer: `${kecepatan.toFixed(2)} km/jam`,
        calculation: `${jarak} ÷ ${waktu} = ${kecepatan.toFixed(2)}`
    };
}

function solvePercentage(text, numbers) {
    const nilai = numbers[0];
    const persen = numbers[1];
    const hasil = (nilai * persen) / 100;
    
    return {
        formula: 'Hasil = (Nilai × Persentase) ÷ 100',
        steps: [
            `Diketahui: Nilai = ${nilai}, Persentase = ${persen}%`,
            `Hasil = (${nilai} × ${persen}) ÷ 100`,
            `Hasil = ${hasil}`
        ],
        answer: `${hasil}`,
        calculation: `(${nilai} × ${persen}) ÷ 100 = ${hasil}`
    };
}

function solveAverage(text, numbers) {
    const total = numbers.reduce((a, b) => a + b, 0);
    const rataRata = total / numbers.length;
    
    return {
        formula: 'Rata-rata = Total ÷ Jumlah Data',
        steps: [
            `Diketahui: Data = ${numbers.join(', ')}`,
            `Total = ${numbers.join(' + ')} = ${total}`,
            `Rata-rata = ${total} ÷ ${numbers.length}`,
            `Rata-rata = ${rataRata.toFixed(2)}`
        ],
        answer: `${rataRata.toFixed(2)}`,
        calculation: `${total} ÷ ${numbers.length} = ${rataRata.toFixed(2)}`
    };
}

function solveRatio(text, numbers) {
    const a = numbers[0];
    const b = numbers[1];
    const gcd = findGCD(a, b);
    const ratio1 = a / gcd;
    const ratio2 = b / gcd;
    
    return {
        formula: 'Perbandingan = a : b',
        steps: [
            `Diketahui: ${a} dan ${b}`,
            `FPB dari ${a} dan ${b} = ${gcd}`,
            `Perbandingan = ${a}÷${gcd} : ${b}÷${gcd}`,
            `Perbandingan = ${ratio1} : ${ratio2}`
        ],
        answer: `${ratio1} : ${ratio2}`,
        calculation: `${a} : ${b} = ${ratio1} : ${ratio2}`
    };
}

function findGCD(a, b) {
    return b === 0 ? a : findGCD(b, a % b);
}

function solveGeneral(text, numbers) {
    // Detect basic operations
    let result;
    let operation = '';
    let formula = '';
    
    if (text.includes('tambah') || text.includes('jumlah') || text.includes('+')) {
        result = numbers.reduce((a, b) => a + b, 0);
        operation = 'Penjumlahan';
        formula = numbers.join(' + ') + ' = ' + result;
    } else if (text.includes('kurang') || text.includes('-')) {
        result = numbers[0] - numbers[1];
        operation = 'Pengurangan';
        formula = `${numbers[0]} - ${numbers[1]} = ${result}`;
    } else if (text.includes('kali') || text.includes('×') || text.includes('*')) {
        result = numbers.reduce((a, b) => a * b, 1);
        operation = 'Perkalian';
        formula = numbers.join(' × ') + ' = ' + result;
    } else if (text.includes('bagi') || text.includes('÷') || text.includes('/')) {
        result = numbers[0] / numbers[1];
        operation = 'Pembagian';
        formula = `${numbers[0]} ÷ ${numbers[1]} = ${result}`;
    } else {
        result = numbers[0];
        operation = 'Deteksi Angka';
        formula = `Angka yang terdeteksi: ${numbers.join(', ')}`;
    }
    
    return {
        formula: formula,
        steps: [
            `Tipe operasi: ${operation}`,
            `Angka yang ditemukan: ${numbers.join(', ')}`,
            `Hasil perhitungan: ${result}`
        ],
        answer: result.toString(),
        calculation: formula
    };
}

function displayNLPResult(analysis, container) {
    const typeLabels = {
        'jarak': 'Soal Jarak',
        'total_harga': 'Soal Total Harga',
        'luas_lingkaran': 'Soal Luas Lingkaran',
        'luas_persegi': 'Soal Luas Persegi',
        'keliling_persegi': 'Soal Keliling Persegi',
        'volume_kubus': 'Soal Volume Kubus',
        'kecepatan': 'Soal Kecepatan',
        'persentase': 'Soal Persentase',
        'rata_rata': 'Soal Rata-rata',
        'perbandingan': 'Soal Perbandingan',
        'general': 'Soal Umum'
    };
    
    const html = `
        <div class="result-content">
            <h3>📊 Hasil Analisis</h3>
            
            <div class="analysis">
                <p><strong>Jenis Soal:</strong> ${typeLabels[analysis.problemType] || 'Umum'}</p>
                <p><strong>Angka yang terdeteksi:</strong> ${analysis.extractedNumbers.join(', ')}</p>
            </div>
            
            <div class="analysis">
                <p><strong>Rumus:</strong></p>
                <p style="font-family: monospace; color: #4caf50;">${analysis.solution.formula}</p>
            </div>
            
            <div class="calculation">
                <p><strong>Langkah Penyelesaian:</strong></p>
                ${analysis.solution.steps.map((step, i) => `<p>${i + 1}. ${step}</p>`).join('')}
            </div>
            
            <div class="final-answer">
                 Jawaban: ${analysis.solution.answer}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Initialize
updateDisplay();
