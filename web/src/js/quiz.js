export function initQuizzes(root = document) {
  const quizzes = root.querySelectorAll('[data-question-id]');

  quizzes.forEach((quiz) => {
    const correctOption = quiz.dataset.correctOption;
    const status = quiz.querySelector('[role="status"]');
    const inputs = quiz.querySelectorAll('input[type="radio"]');

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        const option = input.closest('.quiz-option');
        const isCorrect = input.value === correctOption;

        quiz.dataset.answered = 'true';
        inputs.forEach((item) => item.closest('.quiz-option')?.classList.remove('is-correct', 'is-incorrect'));
        option?.classList.add(isCorrect ? 'is-correct' : 'is-incorrect');

        if (status) {
          status.className = `quiz-status ${isCorrect ? 'correct' : 'incorrect'}`;
          status.textContent = option?.dataset.feedback || '';
        }
      });
    });
  });
}

