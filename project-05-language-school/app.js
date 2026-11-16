'use strict';
const $=s=>document.querySelector(s), api=PortfolioAPI;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let requestKey=crypto.randomUUID();
async function boot(){try{
  const d=await api.content('school','data.json');
  ['eyebrow','title','description','formTitle','formText'].forEach(id=>$('#'+id).textContent=d[id]);
  $('#email').textContent=d.email;$('#email').href='mailto:'+d.email;
  $('#planGrid').innerHTML=d.plans.map((p,i)=>`<article class="plan"><span class="eyebrow">FORMAT / 0${i+1}</span><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="price">${new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(p.price)}</div><small>${esc(p.unit)}</small><a class="button" href="#apply">This sounds good <span>↗</span></a></article>`).join('');
  $('#steps').innerHTML=d.steps.map((s,i)=>`<article class="step"><span>0${i+1} /</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('');
  if(!api.online)$('#result').textContent='Static preview: enquiries can be saved when the server is running.';
}catch(error){$('#result').textContent=error.message;}}
$('#leadForm').onsubmit=async e=>{
  e.preventDefault();const form=e.currentTarget, button=$('#submit');
  const body=Object.fromEntries(new FormData(form));body.consent=form.consent.checked;body.name=body.name.trim();
  if(body.name.length<2||body.phone.replace(/\D/g,'').length<7){$('#result').textContent='Please enter your name and a valid phone number.';return;}
  if(!api.online){$('#result').textContent='This is a static preview. Your enquiry was not sent. Run the server to test saving.';return;}
  button.disabled=true;
  try{const result=await api.submit('leads/school',body,requestKey);$('#result').textContent='Demo enquiry #'+result.id+' saved on the server. No real call will be made.';requestKey=crypto.randomUUID();form.reset();}
  catch(error){$('#result').textContent=error.message+' Your entries are still here; you can try again.';}
  finally{button.disabled=false;}
};boot();
