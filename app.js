(function () {
  const steps = ['step-welcome', 'step-awareness', 'step-allow', 'step-release', 'step-done'];
  let currentStepIndex = 0;
  let currentBelief = '';

  const form = document.getElementById('form-belief');
  const beliefInput = document.getElementById('belief-input');
  const beliefDisplayAwareness = document.getElementById('belief-display-awareness');
  const beliefDisplayAllow = document.getElementById('belief-display-allow');
  const beliefDisplayRelease = document.getElementById('belief-display-release');
  const questionBlocks = ['q1', 'q2', 'q3'].map((id) => document.getElementById(id));
  const hintAfterRelease = document.getElementById('hint-after-release');
  const btnFinishRelease = document.getElementById('btn-finish-release');
  const btnStartOver = document.getElementById('btn-start-over');

  function showStep(index) {
    if (index < 0 || index >= steps.length) return;
    steps.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('active', i === index);
    });
    currentStepIndex = index;

    if (index === 0) {
      beliefInput.value = '';
      currentBelief = '';
      resetReleaseQuestions();
    }
    if (index === 1 || index === 2 || index === 3) {
      [beliefDisplayAwareness, beliefDisplayAllow, beliefDisplayRelease].forEach((el) => {
        if (el) el.textContent = currentBelief ? `「${currentBelief}」` : '';
      });
    }
    if (index === 3) resetReleaseQuestions();
  }

  function resetReleaseQuestions() {
    questionBlocks.forEach((block, i) => {
      if (!block) return;
      block.classList.toggle('hidden', i !== 0);
    });
    if (hintAfterRelease) hintAfterRelease.classList.add('hidden');
    if (btnFinishRelease) btnFinishRelease.classList.add('hidden');
  }

  function goNext() {
    if (currentStepIndex < steps.length - 1) showStep(currentStepIndex + 1);
  }

  function goPrev() {
    if (currentStepIndex > 0) showStep(currentStepIndex - 1);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = beliefInput.value.trim();
    if (!value) return;
    currentBelief = value;
    showStep(1);
  });

  document.querySelectorAll('[data-next]').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (currentStepIndex === 2) goNext();
      else if (currentStepIndex === 3 && btnFinishRelease && !btnFinishRelease.classList.contains('hidden')) goNext();
      else if (currentStepIndex !== 3) goNext();
    });
  });

  document.querySelectorAll('[data-prev]').forEach((btn) => {
    btn.addEventListener('click', goPrev);
  });

  questionBlocks.forEach((block, i) => {
    if (!block) return;
    const choices = block.querySelectorAll('[data-answer]');
    choices.forEach((choice) => {
      choice.addEventListener('click', function () {
        const nextBlock = questionBlocks[i + 1];
        if (nextBlock) {
          block.classList.add('hidden');
          nextBlock.classList.remove('hidden');
          if (i + 1 === questionBlocks.length) {
            if (hintAfterRelease) hintAfterRelease.classList.remove('hidden');
            if (btnFinishRelease) btnFinishRelease.classList.remove('hidden');
          }
        }
      });
    });
  });

  if (btnStartOver) {
    btnStartOver.addEventListener('click', function () {
      showStep(0);
    });
  }

  showStep(0);
})();
