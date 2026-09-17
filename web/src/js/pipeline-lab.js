import {pipelineSnippet, findTask, findDevice} from '../lib/pipeline.js';

/** Arma el fragmento de `pipeline` que corresponde a la tarea y al dispositivo elegidos. */
export function initPipelineLab(root = document) {
  const labs = root.querySelectorAll('[data-pipeline-lab]');

  labs.forEach((lab) => {
    const taskButtons = [...lab.querySelectorAll('[data-pipeline-task]')];
    const deviceButtons = [...lab.querySelectorAll('[data-pipeline-device]')];
    const code = lab.querySelector('[data-pipeline-code]');
    const note = lab.querySelector('[data-pipeline-note]');
    if (!taskButtons.length || !deviceButtons.length || !code) return;

    function pressed(buttons) {
      return buttons.find((button) => button.getAttribute('aria-pressed') === 'true') || buttons[0];
    }

    function render() {
      const taskId = pressed(taskButtons).dataset.pipelineTask;
      const deviceId = pressed(deviceButtons).dataset.pipelineDevice;
      const snippet = pipelineSnippet(taskId, deviceId);
      if (!snippet) return;

      code.textContent = snippet;
      if (note) note.textContent = `${findTask(taskId).note} ${findDevice(deviceId).note}`;
    }

    function bind(buttons) {
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          render();
        });
      });
    }

    bind(taskButtons);
    bind(deviceButtons);
    render();
  });
}
