// Shared admin code: Supabase client + login guard.
var CFG = window.DOCUTRUST_CONFIG || {};
var sb = null;
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]}); }
function fmt(s){ return new Date(s+"T00:00:00").toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}); }
function say(el,text,ok){ el.className="msg "+(ok?"ok":"bad"); el.textContent=text; }

function initAdmin(onReady){
  var login=$("login"), app=$("app");
  if(!CFG.SUPABASE_URL || CFG.SUPABASE_URL.indexOf("YOUR-PROJECT")>-1 || !CFG.SUPABASE_ANON_KEY || !window.supabase){
    login.innerHTML='<div class="card narrow"><div class="msg bad" style="display:block">Supabase is not configured. Edit config.js with your URL and anon key.</div></div>';
    return;
  }
  sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  login.innerHTML='<div class="card narrow"><h2>🛡️ Admin login</h2><p class="muted">Only authorised admins can continue.</p>'
    +'<label for="em">Email</label><input id="em" type="email" autocomplete="username">'
    +'<label for="pw">Password</label><input id="pw" type="password" autocomplete="current-password">'
    +'<p style="margin-top:24px"><button class="btn" id="li">Log in</button></p><div class="msg" id="lm"></div></div>';

  async function enter(session){
    var r = await sb.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if(r.error || !r.data){
      await sb.auth.signOut();
      say($("lm"),"This account is not an admin.",false);
      return;
    }
    login.hidden=true; app.hidden=false;
    $("who").textContent=session.user.email;
    onReady();
  }
  $("out").onclick=async function(){ await sb.auth.signOut(); location.reload(); };
  $("li").onclick=async function(){
    var b=$("li"); b.disabled=true;
    var r=await sb.auth.signInWithPassword({email:$("em").value.trim(),password:$("pw").value});
    b.disabled=false;
    if(r.error){ say($("lm"),"Login failed. Check email and password.",false); return; }
    enter(r.data.session);
  };
  $("pw").addEventListener("keydown",function(e){ if(e.key==="Enter") $("li").click(); });
  sb.auth.getSession().then(function(r){ if(r.data.session) enter(r.data.session); });
}
