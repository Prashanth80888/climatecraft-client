/* Climate Craft — shared motion engine: cursor, reveals, parallax, nav, marquee */
(function(){
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- custom cursor ---------- */
  if(fine){
    const dot=document.getElementById('cursor'), ring=document.getElementById('cursor-ring'), label=document.getElementById('cursor-label');
    if(dot&&ring){
      let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,curActive=false;
      addEventListener('mousemove',e=>{
        mx=e.clientX;my=e.clientY;
        dot.style.transform=`translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
        if(label){label.style.transform=`translate3d(${mx}px,${my-46}px,0) translate(-50%,-50%) scale(${document.body.classList.contains('cur-label')?1:0.7})`;}
        if(!curActive){curActive=true;requestAnimationFrame(loop);}
      });
      function loop(){
        if(Math.abs(mx-rx)<0.1 && Math.abs(my-ry)<0.1){curActive=false;return;}
        rx+=(mx-rx)*.10;ry+=(my-ry)*.10;
        ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
        if(curActive)requestAnimationFrame(loop);
      }
      addEventListener('mouseleave',()=>{dot.style.opacity=ring.style.opacity=0;});
      addEventListener('mouseenter',()=>{dot.style.opacity=ring.style.opacity=1;});
      const hoverSel='a,button,.btn,.nlink,input,select,textarea,[data-cursor]';
      document.addEventListener('mouseover',e=>{
        const t=e.target.closest('[data-cursor-label]');
        if(t){if(label)label.textContent=t.getAttribute('data-cursor-label');document.body.classList.add('cur-label');return;}
        if(e.target.closest('[data-cursor="drag"]')){document.body.classList.add('cur-drag');return;}
        if(e.target.closest(hoverSel)){document.body.classList.add('cur-hover');}
      });
      document.addEventListener('mouseout',e=>{
        if(e.target.closest('[data-cursor-label]'))document.body.classList.remove('cur-label');
        if(e.target.closest('[data-cursor="drag"]'))document.body.classList.remove('cur-drag');
        if(e.target.closest(hoverSel))document.body.classList.remove('cur-hover');
      });
      addEventListener('scroll',()=>{
        const target=document.elementFromPoint(mx,my);
        if(!target){document.body.classList.remove('cur-label','cur-drag','cur-hover');return;}
        const t=target.closest('[data-cursor-label]');
        if(t){if(label)label.textContent=t.getAttribute('data-cursor-label');document.body.classList.add('cur-label');document.body.classList.remove('cur-drag','cur-hover');return;}
        if(target.closest('[data-cursor="drag"]')){document.body.classList.add('cur-drag');document.body.classList.remove('cur-label','cur-hover');return;}
        if(target.closest(hoverSel)){document.body.classList.add('cur-hover');document.body.classList.remove('cur-label','cur-drag');return;}
        document.body.classList.remove('cur-label','cur-drag','cur-hover');
      },{passive:true});
    }

    /* magnetic pull for buttons/swatches/hotspots toward the pointer */
    const magSel='.btn,.sw,.hot,[data-magnetic]';
    const magActive=new Map();
    document.addEventListener('mouseover',e=>{
      const m=e.target.closest(magSel);
      if(!m||magActive.has(m))return;
      magActive.set(m,m.getBoundingClientRect());
      m.style.transition='transform .2s var(--ease)';
    });
    addEventListener('mousemove',e=>{
      magActive.forEach((rect,m)=>{
        const dx=(e.clientX-(rect.left+rect.width/2))*.22;
        const dy=(e.clientY-(rect.top+rect.height/2))*.22;
        m.style.transform=`translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(0.96)`;
      });
    });
    document.addEventListener('mouseout',e=>{
      const m=e.target.closest(magSel);
      if(!m||!magActive.has(m)||m.contains(e.relatedTarget))return;
      magActive.delete(m);
      m.style.transition='transform .5s cubic-bezier(.34,1.56,.64,1)';
      m.style.transform='translate(0,0)';
    });
  }

  /* ---------- scroll reveals & text splitting ---------- */
  document.querySelectorAll('h1.rv, h2.rv').forEach(el=>{
    if(el.dataset.split)return;
    el.dataset.split=1;
    // Store HTML string logic if inner HTML has elements (like <em>)
    const content = el.innerHTML;
    const isHtml = content.includes('<');
    if(!isHtml) {
      const words = el.innerText.split(' ');
      el.innerHTML = '';
      words.forEach((w,i)=>{
        const s = document.createElement('span'); s.className='split-word'; s.style.transitionDelay=(i*0.04)+'s'; s.textContent=w; el.appendChild(s);
        el.appendChild(document.createTextNode(' '));
      });
    }
  });
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv,.clip,.imgrise,.lines').forEach(el=>{
    if(document.body.classList.contains('boot-lock') && el.closest('.hero')) return;
    io.observe(el);
  });

  /* ---------- parallax + scroll-progress vars ---------- */
  /* ---------- floating connect button (global) ---------- */
  if(!document.getElementById('connectBtn')){
    const a=document.createElement('a');a.id='connectBtn';
    const isSubdir = location.pathname.includes('/case-studies/');
    a.href = isSubdir ? '../contact.html' : 'contact.html';
    a.setAttribute('data-cursor-label','Say hello');
    a.innerHTML='<span class="cd"></span><span class="txt">Connect to us</span>';
    document.body.appendChild(a);
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const isRed = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isRed) {
      document.querySelectorAll('[data-parallax]').forEach(el => {
        const sp = parseFloat(el.dataset.parallax) || 0.15;
        gsap.fromTo(el, { y: () => -window.innerHeight * sp }, { y: () => window.innerHeight * sp, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      });
      document.querySelectorAll('.scaler').forEach(s => {
        const img = s.querySelector('.scaler-img'), cap = s.querySelector('.scaler-cap');
        if (img) gsap.fromTo(img, { scale: 0.5, borderRadius: "40px" }, { scale: 1, borderRadius: "0px", ease: "none", scrollTrigger: { trigger: s, start: "top top", end: "bottom bottom", scrub: 1.2 } });
        if (cap) gsap.fromTo(cap, { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: s, start: "55% top", end: "95% top", scrub: 1.2 } });
      });
      document.querySelectorAll('[data-ring]').forEach(sec => {
        const stage = sec.querySelector('[data-ring-stage]'), ringEl = sec.querySelector('[data-ring-el]'), cap = sec.querySelector('[data-ring-cap]');
        if (stage) gsap.fromTo(stage, { rotateX: 60 }, { rotateX: 2, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 1.2 } });
        if (ringEl) gsap.fromTo(ringEl, { rotateY: 0 }, { rotateY: -360, ease: "none", scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 1.2 } });
        if (cap) {
          const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 1.2 } });
          tl.to(cap, { opacity: 1, duration: 0.08, ease: "none" }).to(cap, { opacity: 1, duration: 0.82, ease: "none" }).to(cap, { opacity: 0, duration: 0.1, ease: "none" });
        }
      });
    }
    document.querySelectorAll('[data-count]').forEach(el => {
      const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, obj = { val: 0 };
      gsap.to(obj, { val: to, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" }, onUpdate: () => el.textContent = obj.val.toFixed(dec) });
    });
  }

  /* ---------- nav state — smooth scroll-driven transition ---------- */
  const nav=document.querySelector('.nav');
  if(nav){
    const heroDark=nav.hasAttribute('data-hero-dark');
    let navP=scrollY>60?1:0,tar=navP,run=false;
    const tick=()=>{
      navP+=Math.min(1,(tar-navP)*.025);
      if(Math.abs(tar-navP)<.002)navP=tar;
      nav.style.setProperty('--nv-bg-op',navP.toFixed(3));
      if(heroDark){
        const bone=[244,241,234],ink=[14,18,16];
        const mix=i=>Math.round(bone[i]+(ink[i]-bone[i])*navP);
        nav.style.setProperty('--nv-txt',`rgb(${mix(0)},${mix(1)},${mix(2)})`);
      }
      nav.classList.toggle('solid',tar>.5);
      if(tar>.5)nav.classList.remove('on-dark');else if(heroDark)nav.classList.add('on-dark');
      if(navP!==tar){requestAnimationFrame(tick);}else run=false;
    };
    addEventListener('scroll',()=>{tar=scrollY>60?1:0;if(!run){run=true;requestAnimationFrame(tick);}},{passive:true});
    tick();
  }

  /* ---------- auto-highlight active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nlink, .navdrawer a:not(.dw-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if(href && href.split('/').pop() === currentPath) {
      link.classList.add('active');
    }
  });

  /* ---------- frame-sequence — Master GSAP Timeline ---------- */
  function seqPath(n){return'shared/media/seq/refine/frame-'+String(n).padStart(4,'0')+'.webp'}
  function initSeq(cv){
    const total=parseInt(cv.dataset.frames||'300',10)
    const sec=cv.closest('.story-container') || cv.closest('[data-frameseq]')
    const pin=sec.querySelector('.seq-pin')
    const cap=sec.querySelector('[data-seq-cap]')
    const whySec=sec.querySelector('.why-layer')
    const ctx=cv.getContext('2d',{alpha:false,willReadFrequently:false})
    const stack=new Array(total+1)
    const mark=new Uint8Array(total+1)
    let idx=1,drawn=0,active=false,cleanup=[]
    
    function fit(){
      const r=cv.getBoundingClientRect()
      const d=Math.min(devicePixelRatio||1,2)
      cv.width=Math.round(r.width*d)
      cv.height=Math.round(r.height*d)
      if(drawn)paint(drawn)
    }
    
    function paint(n){
      const img=stack[n]
      if(!img||mark[n]!==2)return
      const cw=cv.width,ch=cv.height
      const s=Math.max(cw/img.naturalWidth,ch/img.naturalHeight)
      ctx.fillStyle='#0b0f0d';ctx.fillRect(0,0,cw,ch)
      ctx.drawImage(img,(cw-img.naturalWidth*s)/2,(ch-img.naturalHeight*s)/2,img.naturalWidth*s,img.naturalHeight*s)
      drawn=n
    }
    
    function nearest(n){
      if(mark[n]===2)return n
      for(let d=1;d<=total;d++){if(n-d>=1&&mark[n-d]===2)return n-d;if(n+d<=total&&mark[n+d]===2)return n+d}
      return 0
    }
    
    function load(n){
      if(n<1||n>total||mark[n])return
      mark[n]=1;const img=new Image();img.decoding='async';stack[n]=img
      const ready=()=>{mark[n]=2;const r=Math.round(idx);if(n===r||n===nearest(r))paint(n);queue()}
      img.onload=()=>{if(img.decode)img.decode().then(ready,ready);else ready()}
      img.onerror=()=>{mark[n]=0;queue()}
      img.src=seqPath(n)
    }
    
    const CAP=12
    function queue(){
      let busy=0;for(let i=1;i<=total;i++)if(mark[i]===1)busy++
      let slot=CAP-busy;if(slot<=0)return
      const c=Math.round(idx)
      for(let d=0;d<=total&&slot>0;d++){
        if(c+d<=total&&mark[c+d]===0){load(c+d);slot--}
        if(d&&c-d>=1&&mark[c-d]===0){load(c-d);slot--}
      }
    }

    if(typeof ScrollTrigger!=='undefined'&&typeof gsap!=='undefined'){
      const framePx = Math.round(total * 6)       // Playback distance
      const holdPx = Math.round(framePx * 0.1333)  // ~10% of total
      const totalPx = framePx + holdPx

      // Use native CSS sticky pinning for flawless performance
      sec.style.height = `calc(100vh + ${totalPx}px)`;

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onEnter: () => { active=true; queue() },
          onLeave: () => { active=false },
          onEnterBack: () => { active=true; queue() },
          onLeaveBack: () => { active=false }
        }
      });

      const p1 = framePx / totalPx;
      const p2 = holdPx / totalPx;

      const proxy = { frame: 1 };
      
      // Phase A: Frame Playback
      master.to(proxy, {
        frame: total,
        ease: 'none',
        duration: p1,
        onUpdate: () => {
          idx = proxy.frame;
          const r = Math.round(idx);
          const best = nearest(r);
          if(best && best !== drawn) paint(best);
          queue();
        }
      }, 0);

      if (cap) {
        master.fromTo(cap, {
          opacity: 0,
          y: 20
        }, {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: p1 * 0.1
        }, 0);
        master.to(cap, {
          opacity: 0,
          y: -20,
          ease: 'power1.in',
          duration: p1 * 0.15
        }, p1 * 0.85);
      }

      // Phase B: Hold Final Frame
      master.to({}, { duration: p2 }, p1);

      cleanup=[()=>{master.kill();}]

      if('IntersectionObserver'in window){
        const io=new IntersectionObserver(e=>e.forEach(i=>{active=i.isIntersecting;if(active)queue()}),{threshold:0})
        io.observe(sec);cleanup.push(()=>io.disconnect())
      }
    }
    
    fit()
    addEventListener('resize',fit,{passive:true})
    active=true;queue()
    return{cv,sec,total,kill:()=>cleanup.forEach(f=>f())}
  }
  const seqs=[...document.querySelectorAll('.seq-canvas')].map(initSeq);

  /* ---------- mobile nav drawer ---------- */
  const tog=document.querySelector('.navtoggle'),drawer=document.querySelector('.navdrawer');
  if(tog&&drawer){
    const close=()=>{drawer.classList.remove('open');tog.classList.remove('on');if(nav)nav.classList.remove('dw-open');document.body.style.overflow='';};
    tog.addEventListener('click',()=>{const o=drawer.classList.toggle('open');tog.classList.toggle('on',o);if(nav)nav.classList.toggle('dw-open',o);document.body.style.overflow=o?'hidden':'';});
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  }

  /* ---------- active nav link + off-screen marquee pause ---------- */
  const curPath=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.nlink,.navdrawer a').forEach(a=>{const h=(a.getAttribute('href')||'').split('#')[0].toLowerCase();if(h&&h===curPath)a.classList.add('active');});
  document.querySelectorAll('.frow-wrap').forEach(wrap=>{
    const frow=wrap.querySelector('.frow');
    if(!frow)return;
    if('IntersectionObserver'in window){new IntersectionObserver(es=>es.forEach(e=>frow.classList.toggle('io-pause',!e.isIntersecting)),{threshold:0}).observe(wrap);}
    wrap.addEventListener('mouseenter',()=>frow.classList.add('paused'));
    wrap.addEventListener('mouseleave',()=>frow.classList.remove('paused'));
  });
  const tstTrack=document.getElementById('tstTrack');
  /* observer removed to prevent animation pausing bugs */

  /* ---------- scroll progress bar ---------- */
  const bar=document.getElementById('progress');
  if(bar&&typeof gsap!=='undefined')gsap.to(bar,{scaleX:1,ease:"none",scrollTrigger:{trigger:document.body,start:"top top",end:"bottom bottom",scrub:1.2}});

  /* ---------- cleanup ---------- */
  addEventListener('beforeunload',()=>seqs.forEach(s=>s.kill&&s.kill()));
  const dismissPreloader=()=>{
    const pl=document.getElementById('preloader');
    if(pl) {
      if(sessionStorage.getItem('cc_visited')){
        pl.remove();
        document.body.classList.remove('boot-lock');
        document.body.classList.add('boot-complete');
        document.querySelectorAll('.hero .rv, .hero .clip, .hero .imgrise, .hero .lines').forEach(el=>io.observe(el));
      } else {
        sessionStorage.setItem('cc_visited','1');
        setTimeout(()=>{
          pl.classList.add('loaded');
          document.body.classList.remove('boot-lock');
          document.body.classList.add('boot-complete');
          document.querySelectorAll('.hero .rv, .hero .clip, .hero .imgrise, .hero .lines').forEach(el=>io.observe(el));
          if(typeof window.triggerPageTransitionEnter === 'function') window.triggerPageTransitionEnter();
        },600);
      }
    } else {
      document.body.classList.remove('boot-lock');
      document.querySelectorAll('.hero .rv, .hero .clip, .hero .imgrise, .hero .lines').forEach(el=>io.observe(el));
      if(typeof window.triggerPageTransitionEnter === 'function') window.triggerPageTransitionEnter();
    }
  };
  if(document.readyState==='complete') dismissPreloader();
  else addEventListener('load',dismissPreloader);
})();

  /* ---------- inject global video background ---------- */
  if(!document.getElementById('global-bg-container')){
    const bgContainer = document.createElement('div');
    bgContainer.id = 'global-bg-container';
    const isSubdir = location.pathname.includes('/case-studies/');
    const videoSrc = isSubdir ? '../shared/media/uploads/refine_the_video.mp4' : 'shared/media/uploads/refine_the_video.mp4';
    const posterSrc = isSubdir ? '../shared/media/uploads/WhatsApp%20Image%202026-07-17%20at%2011.50.09%20AM.jpeg' : 'shared/media/uploads/WhatsApp%20Image%202026-07-17%20at%2011.50.09%20AM.jpeg';
    bgContainer.innerHTML = `<video id="global-bg-video" autoplay muted loop playsinline preload="auto" poster="${posterSrc}"><source src="${videoSrc}" type="video/mp4"></video><div class="global-bg-overlay"></div>`;
    document.body.insertBefore(bgContainer, document.body.firstChild);
  }

  /* ---------- accordion interactivity ---------- */
  document.addEventListener('click', e => {
    const header = e.target.closest('.accordion-header');
    if (header) {
      const item = header.closest('.accordion-item');
      if (item) {
        const isAlreadyActive = item.classList.contains('active');
        const parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        }
        if (!isAlreadyActive) {
          item.classList.add('active');
        }
      }
    }
  });

  /* ---------- case study filter pills ---------- */
  document.addEventListener('click', e => {
    const filterBtn = e.target.closest('.cs-filter-btn');
    if (filterBtn) {
      const category = filterBtn.dataset.category || 'all';
      const container = filterBtn.closest('.cs-section') || document;
      container.querySelectorAll('.cs-filter-btn').forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');

      container.querySelectorAll('.cs-card-item').forEach(card => {
        const cardCat = card.dataset.category || '';
        if (category === 'all' || cardCat.toLowerCase().includes(category.toLowerCase())) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });

  /* ---------- inject dynamic animated background globally ---------- */
  if(!document.querySelector('.collbg.fixed')) {
    const cbg = document.createElement('div');
    cbg.className = 'collbg fixed';
    cbg.setAttribute('aria-hidden', 'true');
    cbg.innerHTML = '<span class="cb cb1"></span><span class="cb cb2"></span><span class="cb cb3"></span>';
    document.body.insertBefore(cbg, document.body.firstChild);
  }

  /* ---------- page transitions (color rising effect) ---------- */
  const pt = document.createElement('div');
  pt.id = 'page-transition';
  Object.assign(pt.style, {
    position: 'fixed', left: '0', right: '0', top: '0', height: '100vh',
    zIndex: '999999', background: 'linear-gradient(180deg, #99e0da 0%, #ccf0ee 100%)',
    pointerEvents: 'none', transform: 'translateY(100%)'
  });
  document.body.appendChild(pt);
  
  window.triggerPageTransitionEnter = () => {
    requestAnimationFrame(() => {
      pt.style.transition = 'none';
      pt.style.transform = 'translateY(0%)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pt.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
        pt.style.transform = 'translateY(-100%)';
      }));
    });
  };
  
  if(!document.getElementById('preloader')) {
    window.triggerPageTransitionEnter();
  }
  
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if(link && link.href && link.host === location.host && link.target !== '_blank'){
      const href = link.getAttribute('href') || '';
      if(!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        if(link.pathname === location.pathname && link.hash) return;
        e.preventDefault();
        
        pt.style.transition = 'none';
        pt.style.transform = 'translateY(100%)';
        
        requestAnimationFrame(() => requestAnimationFrame(() => {
          pt.style.transition = 'transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)';
          pt.style.transform = 'translateY(0%)';
          setTimeout(() => location.href = link.href, 450);
        }));
      }
    }
  }, true);
