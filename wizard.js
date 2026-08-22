/* ================= Wizard logic ================= */
let wGender = 'F';
let wCurrentStep = 1;
const wTotalSteps = 5;

const wStepTitles = {
  1: 'Age',
  2: 'Sex assigned at birth',
  3: 'Heart & breathing rate',
  4: 'Oxygen & blood pressure',
  5: 'Review'
};

function goToWizard(){
  document.getElementById('wizard-root').classList.add('visible');
  document.getElementById('methodology-root').classList.remove('visible');
  document.getElementById('wizard-root').scrollIntoView({behavior:'smooth', block:'start'});
}
function goToMethodology(){
  document.getElementById('methodology-root').classList.add('visible');
  document.getElementById('methodology-root').scrollIntoView({behavior:'smooth', block:'start'});
}

function wSetGender(g){
  wGender = g;
  document.getElementById('wBtnF').classList.toggle('active', g==='F');
  document.getElementById('wBtnM').classList.toggle('active', g==='M');
}
function wClamp(x,a,b){ return Math.max(a, Math.min(b,x)); }

function wRenderLive(){
  document.getElementById('wAgeVal').textContent = document.getElementById('wAge').value + ' yrs';
  document.getElementById('wHrVal').textContent  = document.getElementById('wHr').value + ' bpm';
  document.getElementById('wRrVal').textContent  = document.getElementById('wRr').value + ' br/min';
  document.getElementById('wO2Val').textContent  = document.getElementById('wO2').value + '%';
  document.getElementById('wSbpVal').textContent = document.getElementById('wSbp').value + ' mmHg';
  document.getElementById('wDbpVal').textContent = document.getElementById('wDbp').value + ' mmHg';
}

function wShowStep(n){
  document.querySelectorAll('.w-step-view').forEach(el=>{
    el.classList.toggle('active', +el.dataset.wstep === n);
  });
  document.getElementById('wStepLabel').textContent = `Step ${n} of ${wTotalSteps}`;
  document.getElementById('wStepTitle').textContent = wStepTitles[n];
  document.getElementById('wVialFill').style.height = (n/wTotalSteps*100) + '%';
  document.getElementById('wBackBtn').style.visibility = n === 1 ? 'hidden' : 'visible';
  document.getElementById('wNextBtn').textContent = n === wTotalSteps ? 'Get my estimate' : 'Continue';
  if (n === 5) wBuildReview();
}

const wIcons = {
  age: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9"/></svg>',
  sexF: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="9" r="6"/><path stroke-linecap="round" d="M12 15v7M8.5 19h7"/></svg>',
  sexM: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="6"/><path d="M15 9l6-6M15 3h6v6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-4 3 8 2-6 1.5 2H21"/><path d="M12 20.5C6 16.5 3 13 3 9.2 3 6.3 5.2 4 8 4c1.7 0 3.2.9 4 2.3C12.8 4.9 14.3 4 16 4c2.8 0 5 2.3 5 5.2 0 3.8-3 7.3-9 11.3z" opacity="0.35"/></svg>',
  lungs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v8"/><path d="M12 11c-1-2-3-2-4-1-2 1.5-2 5-1 8 .6 1.6 2 2 3 1s1.5-2 2-4"/><path d="M12 11c1-2 3-2 4-1 2 1.5 2 5 1 8-.6 1.6-2 2-3 1s-1.5-2-2-4"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 2.5S5.5 11 5.5 15.5A6.5 6.5 0 0012 22a6.5 6.5 0 006.5-6.5C18.5 11 12 2.5 12 2.5z"/></svg>',
  gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15a8 8 0 1116 0"/><path d="M12 15l3.5-4.5"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg>'
};

function wBuildReview(){
  const hr  = document.getElementById('wHr').value;
  const rr  = document.getElementById('wRr').value;
  const o2  = document.getElementById('wO2').value;
  const sbp = document.getElementById('wSbp').value;
  const dbp = document.getElementById('wDbp').value;
  const age = document.getElementById('wAge').value;

  const aboutRows = [
    [wIcons.age, 'Age', age + ' yrs'],
    [wGender === 'F' ? wIcons.sexF : wIcons.sexM, 'Sex assigned at birth', wGender === 'F' ? 'Female' : 'Male'],
  ];
  const vitalRows = [
    [wIcons.heart, 'Heart rate', hr + ' bpm'],
    [wIcons.lungs, 'Respiratory rate', rr + ' br/min'],
    [wIcons.drop, 'Oxygen saturation', o2 + '%'],
    [wIcons.gauge, 'Systolic BP', sbp + ' mmHg'],
    [wIcons.gauge, 'Diastolic BP', dbp + ' mmHg'],
  ];

  const renderRows = rows => rows.map(r =>
    `<div class="w-review-row"><span class="w-k"><span class="w-ricon">${r[0]}</span>${r[1]}</span><span class="w-v">${r[2]}</span></div>`
  ).join('');

  document.getElementById('wReviewListAbout').innerHTML = renderRows(aboutRows);
  document.getElementById('wReviewListVitals').innerHTML = renderRows(vitalRows);
}

function wNextStep(){
  if (wCurrentStep < wTotalSteps){
    wCurrentStep++;
    wShowStep(wCurrentStep);
  } else {
    wComputeResult();
    const block = document.getElementById('wWizardPanel');
    const vialBlock = document.getElementById('w-vial-progress-block');
    const trustBlock = document.getElementById('w-trust-row-block');
    block.classList.add('w-wizard-exit');
    setTimeout(()=>{
      block.style.display = 'none';
      vialBlock.style.display = 'none';
      trustBlock.style.display = 'none';
      document.getElementById('wResultPanel').classList.add('active');
    }, 320);
  }
}
function wPrevStep(){
  if (wCurrentStep > 1){
    wCurrentStep--;
    wShowStep(wCurrentStep);
  }
}
function wRestart(){
  wCurrentStep = 1;
  const block = document.getElementById('wWizardPanel');
  const vialBlock = document.getElementById('w-vial-progress-block');
  const trustBlock = document.getElementById('w-trust-row-block');
  block.classList.remove('w-wizard-exit');
  block.style.display = 'block';
  vialBlock.style.display = 'flex';
  trustBlock.style.display = 'flex';
  document.getElementById('wResultPanel').classList.remove('active');
  wShowStep(1);
}

function wComputeResult(){
  const hr  = +document.getElementById('wHr').value;
  const rr  = +document.getElementById('wRr').value;
  const o2  = +document.getElementById('wO2').value;
  const sbp = +document.getElementById('wSbp').value;
  const dbp = +document.getElementById('wDbp').value;
  const genderNum = wGender === 'M' ? 1 : 0; // matches LabelEncoder: F=0, M=1

  /* REAL_MODEL_CALL_PLACEHOLDER */
  const modelOutput = score([genderNum, hr, rr, o2, sbp, dbp]);
  const prob = modelOutput[1];
  const pct = Math.round(prob * 100);

  const circumference = 464.9;
  document.getElementById('wGaugeFg').style.strokeDashoffset = circumference * (1 - prob);
  document.getElementById('wPctText').textContent = pct + '%';

  const tag = document.getElementById('wTagText');
  let tier, tierColor, tierBg;
  if (prob < 0.15){ tier='low'; tierColor='#0B6B46'; tierBg='#E6F2ED'; }
  else if (prob < 0.4){ tier='mild watch'; tierColor='#8A5A1E'; tierBg='#FBF0DD'; }
  else { tier='elevated'; tierColor='#A2141B'; tierBg='#FFDAD6'; }
  tag.textContent = tier;
  tag.style.color = tierColor;
  tag.style.background = tierBg;

  const hrFactor  = wClamp((hr - 100) / 18, -1, 2.2);
  const rrFactor  = wClamp((rr - 20) / 6, -1, 2);
  const o2Factor  = wClamp((95 - o2) / 5, -1, 3);
  const sbpFactor = wClamp((90 - sbp) / 20, -1.2, 2.6);
  const dbpFactor = wClamp((60 - dbp) / 25, -0.8, 1.6);

  const factors = [
    {label:'Oxygen saturation', v:o2Factor, low:'within a healthy range', high:'lower than typical'},
    {label:'Systolic BP', v:sbpFactor, low:'holding steady', high:'trending low'},
    {label:'Heart rate', v:hrFactor, low:'within a healthy range', high:'elevated'},
    {label:'Respiratory rate', v:rrFactor, low:'within a healthy range', high:'elevated'},
    {label:'Diastolic BP', v:dbpFactor, low:'holding steady', high:'trending low'},
  ].sort((a,b) => Math.abs(b.v) - Math.abs(a.v));

  const listEl = document.getElementById('wFactorList');
  listEl.innerHTML = '';
  const maxAbs = Math.max(...factors.map(f => Math.abs(f.v)), 0.1);
  factors.slice(0,4).forEach(f=>{
    const dir = f.v > 0.25 ? 'up' : (f.v < -0.25 ? 'down' : 'neutral');
    const text = dir === 'up' ? f.high : (dir === 'down' ? f.low + ' (favorable)' : f.low);
    const barPct = Math.round(wClamp(Math.abs(f.v) / maxAbs, 0.06, 1) * 100);
    const row = document.createElement('div');
    row.className = 'w-factor-row ' + dir;
    row.innerHTML = `<span class="w-factor-dot"></span><span class="w-factor-text">${f.label}</span><span class="w-factor-bar-track"><span class="w-factor-bar-fill" style="width:${barPct}%"></span></span><span class="w-factor-status">${dir === 'neutral' ? 'steady' : (dir === 'up' ? '↑ risk' : '↓ risk')}</span>`;
    listEl.appendChild(row);
  });
}

wRenderLive();
wShowStep(1);
