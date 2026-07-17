function switchTab(evt, id) {
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  const target = document.getElementById(`tab-${id}`);
  if (target) target.classList.add('active');
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
