var app=function(){"use strict";function t(){}const e=t=>t;function s(t,e){for(const s in e)t[s]=e[s];return t}function a(t){return t()}function n(){return Object.create(null)}function i(t){t.forEach(a)}function l(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function o(e,s,a){e.$$.on_destroy.push(function(e,...s){if(null==e)return t;const a=e.subscribe(...s);return a.unsubscribe?()=>a.unsubscribe():a}(s,a))}const c="undefined"!=typeof window;let d=c?()=>window.performance.now():()=>Date.now(),f=c?t=>requestAnimationFrame(t):t;const u=new Set;function m(t){u.forEach((e=>{e.c(t)||(u.delete(e),e.f())})),0!==u.size&&f(m)}function v(t,e){t.appendChild(e)}function b(t){t.parentNode&&t.parentNode.removeChild(t)}function h(t){return document.createElement(t)}function p(t){return document.createTextNode(t)}function g(){return p(" ")}function w(t,e,s){null==s?t.removeAttribute(e):t.getAttribute(e)!==s&&t.setAttribute(e,s)}function y(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let x;function C(t){x=t}function $(t){(function(){if(!x)throw new Error("Function called outside component initialization");return x})().$$.on_mount.push(t)}const k=[],L=[],_=[],M=[],T=Promise.resolve();let S=!1;function E(t){_.push(t)}const P=new Set;let j=0;function A(){const t=x;do{for(;j<k.length;){const t=k[j];j++,C(t),D(t.$$)}for(C(null),k.length=0,j=0;L.length;)L.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];P.has(e)||(P.add(e),e())}_.length=0}while(k.length);for(;M.length;)M.pop()();S=!1,P.clear(),C(t)}function D(t){if(null!==t.fragment){t.update(),i(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const z=new Set;function H(t,e){-1===t.$$.dirty[0]&&(k.push(t),S||(S=!0,T.then(A)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function N(e,s,r,o,c,d,f,u=[-1]){const m=x;C(e);const v=e.$$={fragment:null,ctx:[],props:d,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(s.context||(m?m.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:s.target||m.$$.root};f&&f(v.root);let h=!1;if(v.ctx=r?r(e,s.props||{},((t,s,...a)=>{const n=a.length?a[0]:s;return v.ctx&&c(v.ctx[t],v.ctx[t]=n)&&(!v.skip_bound&&v.bound[t]&&v.bound[t](n),h&&H(e,t)),s})):[],v.update(),h=!0,i(v.before_update),v.fragment=!!o&&o(v.ctx),s.target){if(s.hydrate){const t=function(t){return Array.from(t.childNodes)}(s.target);v.fragment&&v.fragment.l(t),t.forEach(b)}else v.fragment&&v.fragment.c();s.intro&&((p=e.$$.fragment)&&p.i&&(z.delete(p),p.i(g))),function(t,e,s,n){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,s),n||E((()=>{const e=t.$$.on_mount.map(a).filter(l);t.$$.on_destroy?t.$$.on_destroy.push(...e):i(e),t.$$.on_mount=[]})),o.forEach(E)}(e,s.target,s.anchor,s.customElement),A()}var p,g;C(m)}class G{$destroy(){!function(t,e){const s=t.$$;null!==s.fragment&&(i(s.on_destroy),s.fragment&&s.fragment.d(e),s.on_destroy=s.fragment=null,s.ctx=[])}(this,1),this.$destroy=t}$on(e,s){if(!l(s))return t;const a=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return a.push(s),()=>{const t=a.indexOf(s);-1!==t&&a.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const V=[];function J(t){return"[object Date]"===Object.prototype.toString.call(t)}function O(t,e){if(t===e||t!=t)return()=>t;const s=typeof t;if(s!==typeof e||Array.isArray(t)!==Array.isArray(e))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const s=e.map(((e,s)=>O(t[s],e)));return t=>s.map((e=>e(t)))}if("object"===s){if(!t||!e)throw new Error("Object cannot be null");if(J(t)&&J(e)){t=t.getTime();const s=(e=e.getTime())-t;return e=>new Date(t+e*s)}const s=Object.keys(e),a={};return s.forEach((s=>{a[s]=O(t[s],e[s])})),t=>{const e={};return s.forEach((s=>{e[s]=a[s](t)})),e}}if("number"===s){const s=e-t;return e=>t+e*s}throw new Error(`Cannot interpolate ${s} values`)}function Z(a,n={}){const i=function(e,s=t){let a;const n=new Set;function i(t){if(r(e,t)&&(e=t,a)){const t=!V.length;for(const t of n)t[1](),V.push(t,e);if(t){for(let t=0;t<V.length;t+=2)V[t][0](V[t+1]);V.length=0}}}return{set:i,update:function(t){i(t(e))},subscribe:function(l,r=t){const o=[l,r];return n.add(o),1===n.size&&(a=s(i)||t),l(e),()=>{n.delete(o),0===n.size&&(a(),a=null)}}}}(a);let l,o=a;function c(t,r){if(null==a)return i.set(a=t),Promise.resolve();o=t;let c=l,v=!1,{delay:b=0,duration:h=400,easing:p=e,interpolate:g=O}=s(s({},n),r);if(0===h)return c&&(c.abort(),c=null),i.set(a=o),Promise.resolve();const w=d()+b;let y;return l=function(t){let e;return 0===u.size&&f(m),{promise:new Promise((s=>{u.add(e={c:t,f:s})})),abort(){u.delete(e)}}}((e=>{if(e<w)return!0;v||(y=g(a,t),"function"==typeof h&&(h=h(a,t)),v=!0),c&&(c.abort(),c=null);const s=e-w;return s>h?(i.set(a=t),!1):(i.set(a=y(p(s/h))),!0)})),l.promise}return{set:c,update:(t,e)=>c(t(o,a),e),subscribe:i.subscribe}}function B(e){let s,a,n,i,l,r,o,c,d,f,u,m,x,C,$,k,L,_,M,T,S,E,P,j,A,D,z,H,N,G,V,J,O,Z,B,I,Q,q,R,W,Y,K,U,X,tt,et,st,at,nt,it,lt,rt,ot,ct,dt;return{c(){s=h("main"),a=h("nav"),a.innerHTML='<div class="container-fluid"><span></span> \n         <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar"><span class="navbar-toggler-icon"></span></button> \n         <div class="offcanvas offcanvas-start text-white bg-offcanvas" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel"><div class="offcanvas-header"><h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5> \n               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button></div> \n            <div class="offcanvas-body"><ul class="navbar-nav justify-content-end flex-grow-1 pe-3"><li class="nav-item"><a class="nav-link fw-semibold" href="#top">Home</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#about">About</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#skills">Skills</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#skill_timeline">Timeline</a></li></ul></div></div></div>',n=g(),i=h("div"),l=h("section"),r=h("div"),o=h("div"),o.innerHTML='<img src="suyash.44093981.webp" class="img-fluid rounded-pill profile-photo" alt="suyash jawale profile photo"/>',c=g(),d=h("div"),d.textContent="Suyash Jawale",f=g(),u=h("div"),u.textContent="Engineer at Tata Consultancy Services",m=g(),x=h("div"),x.innerHTML='<a target="_blank" href="mailto:suyashjawale245@gmail.com"><i class="text-white fas fa-envelope"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://www.instagram.com/suyash.jawale/"><i class="text-white fab fa-instagram"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/suyashjawale/"><i class="text-white fab fa-linkedin"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://github.com/suyashjawale"><i class="text-white fab fa-github"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://medium.com/@suyashjawale"><i class="text-white fab fa-medium"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://twitter.com/the_suyash_"><i class="text-white fab fa-twitter"></i></a> \n               <a target="_blank" rel="noreferrer" href="https://stackoverflow.com/users/9807249/suyash-jawale"><i class="text-white fab fa-stack-overflow"></i></a> ',C=g(),$=h("div"),k=p(e[0]),L=g(),_=h("div"),M=h("progress"),T=g(),S=h("section"),E=h("div"),E.textContent="Experience",P=g(),j=h("div"),A=h("div"),D=h("h5"),D.textContent="Engineer",z=g(),H=h("div"),H.textContent="Tata Consultancy Services",N=g(),G=h("small"),V=h("div"),J=h("div"),J.textContent="Jan 2021 - Present",O=g(),Z=h("div"),B=p(e[1]),I=g(),Q=h("div"),q=h("hr"),R=g(),W=h("ul"),W.innerHTML='<li class="my-2">Proven ability to implement machine learning and deep learning models to solve real-world problems</li> \n                     <li class="my-2">Strong understanding of natural language processing techniques, including sentiment analysis and text classification</li> \n                     <li class="my-2">2+ years of professional experience in the field of machine learning and deep learning, with a focus on natural language processing.</li> \n                     <li class="my-2">Proficient in utilizing data analysis and visualization tools, such as Python, R, and SQL.</li> \n                     <li class="my-2">Experience in the deployment of machine learning models to production environments utilizing cloud-based platforms, such as AWS and GCP.</li> \n                     <li class="my-2">Solid understanding of data management and database management systems.</li> \n                     <li class="my-2">Experience in mentoring junior team members.</li> \n                     <li class="my-2">Worked with research and development team to optimize existing algorithms and improve performance.</li>',Y=g(),K=h("div"),K.innerHTML='<div id="liveToast" class="rounded toast fade hide shadow" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="10000"><div class="toast-header bg-custom"><svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-6 w-6"><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="#00ffbf"></path></svg> \n                           <strong class="me-auto"></strong> \n                           <small>Generated by ChatGPT</small> \n                           <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div> \n                        <div class="toast-body bg-custom rounded"><div class="border border-1 rounded py-2"><div class="mx-2">Description is optimized using ChatGPT.</div></div> \n                           <div class="py-2 mx-2 fw-semibold">Query</div> \n                           <div class="border border-1 rounded py-2"><div class="mx-2">I work on machine learning , deep learning, nlp , data analysis , api development, managing databases. I also train other employees and i work with the research and development team. I have optimized existing algorithms to work faster. I have deployed many ml models to production.optimize this into bullet points for my resume</div></div></div></div>',U=g(),X=h("div"),tt=h("span"),tt.innerHTML='<span id="chatgpt">Generated by ChatGPT </span><span class="align-middle">ⓘ</span>',et=g(),st=h("div"),st.textContent="Education",at=g(),nt=h("div"),nt.innerHTML='<div class="card-body"><h5 class="card-title">Master In Computer Science</h5> \n               <div class="fw-semibold">Pune University</div> \n               <div><small class="fw-light">June 2020 - June 2022</small></div> \n               <div class="card-text fw-light mt-2">CGPA 9.6</div></div>',it=g(),lt=h("section"),lt.innerHTML='<div class="fs-2 text-white ms-1 mt-2">Skills</div> \n         <small class="fw-lighter text-white ms-1">Categorized by domains.</small> \n         <div class="row"><div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Languages</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Rust</li> \n                        <li class="col-6">Python</li> \n                        <li class="col-6">Javascript</li> \n                        <li class="col-6">PHP</li> \n                        <li class="col-6">Java</li> \n                        <li class="col-6">C</li> \n                        <li class="col-6">C++</li> \n                        <li class="col-6">Golang</li> \n                        <li class="col-6">Kotlin</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Data Science</div> \n                  <div class="card-body"><div class="row"><li class="col-12">Natural Language Processing</li> \n                        <li class="col-12">Computer Vision</li> \n                        <li class="col-12">Predictive analysis</li> \n                        <li class="col-12">Transfer learning</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Backend</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Actix-web</li> \n                        <li class="col-6">NodeJS</li> \n                        <li class="col-6">ExpressJS</li> \n                        <li class="col-6">Fastify</li> \n                        <li class="col-6">Flask</li> \n                        <li class="col-6">Go Fiber</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Databases</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Redis</li> \n                        <li class="col-6">MongoDB</li> \n                        <li class="col-6">MySQL</li> \n                        <li class="col-6">Postgres</li> \n                        <li class="col-6">OracleDB</li> \n                        <li class="col-6">SAP Hana</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Frontend</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Svelte</li> \n                        <li class="col-6">JQuery</li> \n                        <li class="col-6">HTML5 / Css3</li> \n                        <li class="col-6">Bootstrap</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Testing &amp; Automation</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Selenium</li> \n                        <li class="col-6">Postman</li> \n                        <li class="col-12">Thunderclient</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">DevOps</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Git</li> \n                        <li class="col-6">Docker</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Cloud Services</div> \n                  <div class="card-body"><div class="row"><li class="col-6">AWS</li> \n                        <li class="col-6">Azure</li> \n                        <li class="col-6">Digitalocean</li> \n                        <li class="col-6">Heroku</li></div></div></div></div></div>',rt=g(),ot=h("section"),ot.innerHTML='<div class="fs-2">Projects</div>',w(a,"class","navbar navbar-dark bg-transparent fixed-top"),w(o,"class","m-4"),w(d,"class","display-3 text-white"),w(u,"class","lh-lg fs-6 fw-semibold text-white"),w(x,"class","fs-4 lh-lg text-center"),w($,"class","fs-6 fw-semibold text-white mt-2"),M.value=e[2],w(M,"class","w-100"),w(_,"class","mx-lg-5 mt-3"),w(r,"class","text-center"),w(l,"id","home"),w(l,"class","pt-5"),w(E,"class","fs-2 text-white ms-1 my-2"),w(D,"class","card-title"),w(H,"class","fw-semibold"),w(V,"class","d-flex justify-content-between"),w(G,"class","fw-light"),w(W,"class","ps-custom"),w(K,"class","toast-container position-fixed bottom-0 start-50 translate-middle-x p-3 "),w(tt,"type","button"),w(X,"class","text-end"),w(Q,"class","card-text fw-light mt-3"),w(A,"class","card-body"),w(j,"class","card border-primary mb-3 bg-transparent text-white"),w(st,"class","fs-2 text-white ms-1 my-2"),w(nt,"class","card border-primary mb-3 bg-transparent text-white"),w(S,"id","about"),w(S,"class","text-start mt-3"),w(lt,"id","skills"),w(ot,"id","projects"),w(ot,"class","my-2 text-white my-2"),w(i,"class","container mb-5")},m(t,e){var b,h,p,g;!function(t,e,s){t.insertBefore(e,s||null)}(t,s,e),v(s,a),v(s,n),v(s,i),v(i,l),v(l,r),v(r,o),v(r,c),v(r,d),v(r,f),v(r,u),v(r,m),v(r,x),v(r,C),v(r,$),v($,k),v(r,L),v(r,_),v(_,M),v(i,T),v(i,S),v(S,E),v(S,P),v(S,j),v(j,A),v(A,D),v(A,z),v(A,H),v(A,N),v(A,G),v(G,V),v(V,J),v(V,O),v(V,Z),v(Z,B),v(A,I),v(A,Q),v(Q,q),v(Q,R),v(Q,W),v(Q,Y),v(Q,K),v(Q,U),v(Q,X),v(X,tt),v(S,et),v(S,st),v(S,at),v(S,nt),v(i,it),v(i,lt),v(i,rt),v(i,ot),ct||(h="click",p=F,(b=tt).addEventListener(h,p,g),dt=()=>b.removeEventListener(h,p,g),ct=!0)},p(t,[e]){1&e&&y(k,t[0]),4&e&&(M.value=t[2]),2&e&&y(B,t[1])},i:t,o:t,d(t){t&&b(s),ct=!1,dt()}}}function F(){let t=document.getElementById("liveToast");new bootstrap.Toast(t).show()}function I(t,e,s){let a,n="",i="",l=new Date,r=l.getFullYear(),c=l.getMonth(),d=l.getDate();const f=Z(0,{duration:6e3});function u(t,e,s){let a=r-t;if(c>=e)var n=c-e;else{a--;n=12+c-e}if(d>=s)var i=d-s;else{n--;i=31+d-s;n<0&&(n=11,a--)}return[a,n,i]}return o(t,f,(t=>s(2,a=t))),$((()=>{let t=u(1999,7,3),e=u(2021,0,21);f.set(t[0]/30),s(0,n=`${t[0]} Years, ${t[1]} Months, ${t[2]} Days`),s(1,i=`${e[0]} Years, ${e[1]} Months`)})),[n,i,a,f]}return new class extends G{constructor(t){super(),N(this,t,I,B,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
