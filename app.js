// レンジ計算機のメインロジック

// DOM要素の取得
const sourceWattSelector = document.getElementById('sourceWattSelector');
const targetWattSelector = document.getElementById('targetWattSelector');
const inputMinutes = document.getElementById('inputMinutes');
const inputSeconds = document.getElementById('inputSeconds');
const calculateButton = document.getElementById('calculateButton');
const resultSection = document.getElementById('resultSection');
const resultTime = document.getElementById('resultTime');
const resultSeconds = document.getElementById('resultSeconds');
const errorMessage = document.getElementById('errorMessage');

// 選択されたワット数を保持
let sourceWatt = 500;
let targetWatt = 800;

// ワット数選択ボタンのイベント設定
function setupWattSelectors() {
    // 元のワット数
    sourceWattSelector.querySelectorAll('.watt-option').forEach(option => {
        option.addEventListener('click', () => {
            sourceWattSelector.querySelectorAll('.watt-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            sourceWatt = parseInt(option.dataset.watt);
            hideError();
        });
    });

    // 変換先のワット数
    targetWattSelector.querySelectorAll('.watt-option').forEach(option => {
        option.addEventListener('click', () => {
            targetWattSelector.querySelectorAll('.watt-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
            targetWatt = parseInt(option.dataset.watt);
            hideError();
        });
    });
}

// 入力フィールドのイベント設定
function setupInputFields() {
    // 入力時にエラーを消す
    inputMinutes.addEventListener('input', () => {
        hideError();
        // 負の数を防ぐ
        if (inputMinutes.value < 0) {
            inputMinutes.value = 0;
        }
    });

    inputSeconds.addEventListener('input', () => {
        hideError();
        // 負の数と60以上を防ぐ
        if (inputSeconds.value < 0) {
            inputSeconds.value = 0;
        }
        if (inputSeconds.value > 59) {
            inputSeconds.value = 59;
        }
    });

    // Enterキーで計算
    inputMinutes.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });

    inputSeconds.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculate();
        }
    });
}

// エラー表示
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    resultSection.classList.add('hidden');
}

// エラー非表示
function hideError() {
    errorMessage.classList.remove('show');
}

// 計算実行
function calculate() {
    hideError();

    // 入力値の取得
    const minutes = parseFloat(inputMinutes.value) || 0;
    const seconds = parseFloat(inputSeconds.value) || 0;

    // バリデーション
    // 1. 時間が0の場合
    if (minutes === 0 && seconds === 0) {
        showError('時間を入力してください');
        return;
    }

    // 2. 元のワット数と変換先のワット数が同じ場合
    if (sourceWatt === targetWatt) {
        showError('変換先のワット数を変更してください');
        return;
    }

    // 3. ワット数が0以下の場合（念のため）
    if (sourceWatt <= 0 || targetWatt <= 0) {
        showError('正しいワット数を選択してください');
        return;
    }

    // 元の時間を秒に変換
    const totalSeconds = minutes * 60 + seconds;

    // 計算式: (元W × 元時間) ÷ 新W
    const resultTotalSeconds = (sourceWatt * totalSeconds) / targetWatt;

    // 1秒単位で切り上げ
    const roundedSeconds = Math.ceil(resultTotalSeconds);

    // 分と秒に分解
    const resultMinutes = Math.floor(roundedSeconds / 60);
    const resultSecondsOnly = roundedSeconds % 60;

    // 結果を表示
    displayResult(resultMinutes, resultSecondsOnly, roundedSeconds);
}

// 結果表示
function displayResult(minutes, seconds, totalSeconds) {
    // 時間表示（2:38形式）
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    resultTime.textContent = timeString;

    // 秒数表示
    resultSeconds.textContent = `${totalSeconds}秒`;

    // 結果セクションを表示
    resultSection.classList.remove('hidden');

    // スムーズにスクロール（モバイル対応）
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// 計算ボタンのイベント
calculateButton.addEventListener('click', calculate);

// 初期化
setupWattSelectors();
setupInputFields();

// デバッグ用（本番では削除可能）
console.log('レンジ計算機が起動しました');
