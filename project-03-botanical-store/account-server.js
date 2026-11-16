window.ServerAccount = {
  async open(core, show) {
    const api=PortfolioAPI, esc=core.escape;
    if (!api.token) {
      show('<p class="eyebrow">Server account</p><h2 id="customerTitle">Welcome</h2><form id="serverAuth"><label>Name (for registration)<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="username"></label><label>Password<input name="password" type="password" required autocomplete="current-password"></label><p>Passwords must be at least 12 characters long.</p><p id="authError" role="alert"></p><button class="button button-dark" name="action" value="login">Sign in</button> <button class="button" name="action" value="register">Create account</button></form>');
      document.querySelector('#serverAuth').onsubmit=async e=>{
        e.preventDefault();const form=e.currentTarget, body=Object.fromEntries(new FormData(form));
        const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
        try {
          if(e.submitter?.value==='register')await api.call('register',{method:'POST',body:JSON.stringify(body)});
          await api.login(body.email,body.password);await this.open(core,show);
        }catch(error){document.querySelector('#authError').textContent=error.message;}
        finally{buttons.forEach(b=>b.disabled=false);}
      };return;
    }
    try {
      const [profile,history]=await Promise.all([api.call('me'),api.call('my-orders')]);
      show(`<p class="eyebrow">Server account</p><h2 id="customerTitle">${esc(profile.user.name)}</h2><p>${esc(profile.user.email)}</p><button class="button" id="accountLogout">Sign out</button><section class="detail-block"><h3>My orders</h3>${history.records.length?history.records.map(r=>`<article class="order-history"><strong>STORE-${r.id} · ${core.money(r.body.total)}</strong><p>${esc(({new:'New',processing:'Processing',done:'Complete',cancelled:'Cancelled'})[r.status])}</p><p>${r.body.items.map(p=>esc(p.name)+' × '+p.qty).join(', ')}</p></article>`).join(''):'<p>No orders yet. Orders placed after signing in will appear here.</p>'}</section><p>Online payments and a live rewards program are not connected.</p>`);
      document.querySelector('#accountLogout').onclick=async()=>{await api.logout();await this.open(core,show);};
    } catch(error) {show(`<h2 id="customerTitle">Could not open your account</h2><p>${esc(error.message)}</p><button class="button" id="accountRetry">Try signing in again</button>`);document.querySelector('#accountRetry').onclick=async()=>{try{await api.logout();}catch{}await this.open(core,show);};}
  }
};
