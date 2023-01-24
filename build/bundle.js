var app=function(){"use strict";function t(){}const e=t=>t;function i(t,e){for(const i in e)t[i]=e[i];return t}function s(t){return t()}function a(){return Object.create(null)}function l(t){t.forEach(s)}function n(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function o(e,i,s){e.$$.on_destroy.push(function(e,...i){if(null==e)return t;const s=e.subscribe(...i);return s.unsubscribe?()=>s.unsubscribe():s}(i,s))}const c="undefined"!=typeof window;let d=c?()=>window.performance.now():()=>Date.now(),f=c?t=>requestAnimationFrame(t):t;const p=new Set;function h(t){p.forEach((e=>{e.c(t)||(p.delete(e),e.f())})),0!==p.size&&f(h)}function m(t,e){t.appendChild(e)}function u(t){t.parentNode&&t.parentNode.removeChild(t)}function v(t){return document.createElement(t)}function g(t){return document.createTextNode(t)}function C(){return g(" ")}function b(t,e,i){null==i?t.removeAttribute(e):t.getAttribute(e)!==i&&t.setAttribute(e,i)}function w(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let x;function y(t){x=t}function k(t){(function(){if(!x)throw new Error("Function called outside component initialization");return x})().$$.on_mount.push(t)}const _=[],L=[],V=[],S=[],$=Promise.resolve();let M=!1;function G(t){V.push(t)}const A=new Set;let j=0;function E(){const t=x;do{for(;j<_.length;){const t=_[j];j++,y(t),z(t.$$)}for(y(null),_.length=0,j=0;L.length;)L.pop()();for(let t=0;t<V.length;t+=1){const e=V[t];A.has(e)||(A.add(e),e())}V.length=0}while(_.length);for(;S.length;)S.pop()();M=!1,A.clear(),y(t)}function z(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(G)}}const R=new Set;function T(t,e){-1===t.$$.dirty[0]&&(_.push(t),M||(M=!0,$.then(E)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function D(e,i,r,o,c,d,f,p=[-1]){const h=x;y(e);const m=e.$$={fragment:null,ctx:[],props:d,update:t,not_equal:c,bound:a(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(h?h.$$.context:[])),callbacks:a(),dirty:p,skip_bound:!1,root:i.target||h.$$.root};f&&f(m.root);let v=!1;if(m.ctx=r?r(e,i.props||{},((t,i,...s)=>{const a=s.length?s[0]:i;return m.ctx&&c(m.ctx[t],m.ctx[t]=a)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](a),v&&T(e,t)),i})):[],m.update(),v=!0,l(m.before_update),m.fragment=!!o&&o(m.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);m.fragment&&m.fragment.l(t),t.forEach(u)}else m.fragment&&m.fragment.c();i.intro&&((g=e.$$.fragment)&&g.i&&(R.delete(g),g.i(C))),function(t,e,i,a){const{fragment:r,after_update:o}=t.$$;r&&r.m(e,i),a||G((()=>{const e=t.$$.on_mount.map(s).filter(n);t.$$.on_destroy?t.$$.on_destroy.push(...e):l(e),t.$$.on_mount=[]})),o.forEach(G)}(e,i.target,i.anchor,i.customElement),E()}var g,C;y(h)}class H{$destroy(){!function(t,e){const i=t.$$;null!==i.fragment&&(l(i.on_destroy),i.fragment&&i.fragment.d(e),i.on_destroy=i.fragment=null,i.ctx=[])}(this,1),this.$destroy=t}$on(e,i){if(!n(i))return t;const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(i),()=>{const t=s.indexOf(i);-1!==t&&s.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const P=[];function B(t){return"[object Date]"===Object.prototype.toString.call(t)}function Z(t,e){if(t===e||t!=t)return()=>t;const i=typeof t;if(i!==typeof e||Array.isArray(t)!==Array.isArray(e))throw new Error("Cannot interpolate values of different type");if(Array.isArray(t)){const i=e.map(((e,i)=>Z(t[i],e)));return t=>i.map((e=>e(t)))}if("object"===i){if(!t||!e)throw new Error("Object cannot be null");if(B(t)&&B(e)){t=t.getTime();const i=(e=e.getTime())-t;return e=>new Date(t+e*i)}const i=Object.keys(e),s={};return i.forEach((i=>{s[i]=Z(t[i],e[i])})),t=>{const e={};return i.forEach((i=>{e[i]=s[i](t)})),e}}if("number"===i){const i=e-t;return e=>t+e*i}throw new Error(`Cannot interpolate ${i} values`)}function F(s,a={}){const l=function(e,i=t){let s;const a=new Set;function l(t){if(r(e,t)&&(e=t,s)){const t=!P.length;for(const t of a)t[1](),P.push(t,e);if(t){for(let t=0;t<P.length;t+=2)P[t][0](P[t+1]);P.length=0}}}return{set:l,update:function(t){l(t(e))},subscribe:function(n,r=t){const o=[n,r];return a.add(o),1===a.size&&(s=i(l)||t),n(e),()=>{a.delete(o),0===a.size&&(s(),s=null)}}}}(s);let n,o=s;function c(t,r){if(null==s)return l.set(s=t),Promise.resolve();o=t;let c=n,m=!1,{delay:u=0,duration:v=400,easing:g=e,interpolate:C=Z}=i(i({},a),r);if(0===v)return c&&(c.abort(),c=null),l.set(s=o),Promise.resolve();const b=d()+u;let w;return n=function(t){let e;return 0===p.size&&f(h),{promise:new Promise((i=>{p.add(e={c:t,f:i})})),abort(){p.delete(e)}}}((e=>{if(e<b)return!0;m||(w=C(s,t),"function"==typeof v&&(v=v(s,t)),m=!0),c&&(c.abort(),c=null);const i=e-b;return i>v?(l.set(s=t),!1):(l.set(s=w(g(i/v))),!0)})),n.promise}return{set:c,update:(t,e)=>c(t(o,s),e),subscribe:l.subscribe}}function O(e){let i,s,a,l,n,r,o,c,d,f,p,h,x,y,k,_,L,V,S,$,M,G,A,j,E,z,R,T,D,H,P,B,Z,F,O,J,I,U,W,Q,q,Y,K,X,tt,et,it,st,at,lt,nt,rt,ot,ct,dt;return{c(){i=v("main"),s=v("nav"),s.innerHTML='<div class="container-fluid"><span></span> \n         <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar"><span class="navbar-toggler-icon"></span></button> \n         <div class="offcanvas offcanvas-start text-white bg-offcanvas" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel"><div class="offcanvas-header"><h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5> \n               <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button></div> \n            <div class="offcanvas-body"><ul class="navbar-nav justify-content-end flex-grow-1 pe-3"><li class="nav-item"><a class="nav-link fw-semibold" href="#top">Home</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#about">About</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#skills">Skills</a></li> \n                  <li class="nav-item"><a class="nav-link fw-semibold" href="#projects">Projects</a></li></ul></div></div></div>',a=C(),l=v("div"),n=v("section"),r=v("div"),o=v("div"),o.innerHTML='<img src="suyash.44093981.webp" class="img-fluid rounded-pill profile-photo" alt="suyash jawale profile photo"/>',c=C(),d=v("div"),d.textContent="Suyash Jawale",f=C(),p=v("div"),p.textContent="Engineer at Tata Consultancy Services",h=C(),x=v("div"),x.innerHTML='<a target="_blank" href="mailto:suyashjawale245@gmail.com"><svg width="1.97rem" height="1.97rem" viewBox="0 0 32.00 32.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="0" y="0" width="32.00" height="32.00" rx="6.4" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2 11.9556C2 8.47078 2 6.7284 2.67818 5.39739C3.27473 4.22661 4.22661 3.27473 5.39739 2.67818C6.7284 2 8.47078 2 11.9556 2H20.0444C23.5292 2 25.2716 2 26.6026 2.67818C27.7734 3.27473 28.7253 4.22661 29.3218 5.39739C30 6.7284 30 8.47078 30 11.9556V20.0444C30 23.5292 30 25.2716 29.3218 26.6026C28.7253 27.7734 27.7734 28.7253 26.6026 29.3218C25.2716 30 23.5292 30 20.0444 30H11.9556C8.47078 30 6.7284 30 5.39739 29.3218C4.22661 28.7253 3.27473 27.7734 2.67818 26.6026C2 25.2716 2 23.5292 2 20.0444V11.9556Z" fill="white"></path><path d="M22.0515 8.52295L16.0644 13.1954L9.94043 8.52295V8.52421L9.94783 8.53053V15.0732L15.9954 19.8466L22.0515 15.2575V8.52295Z" fill="#EA4335"></path><path d="M23.6231 7.38639L22.0508 8.52292V15.2575L26.9983 11.459V9.17074C26.9983 9.17074 26.3978 5.90258 23.6231 7.38639Z" fill="#FBBC05"></path><path d="M22.0508 15.2575V23.9924H25.8428C25.8428 23.9924 26.9219 23.8813 26.9995 22.6513V11.459L22.0508 15.2575Z" fill="#34A853"></path><path d="M9.94811 24.0001V15.0732L9.94043 15.0669L9.94811 24.0001Z" fill="#C5221F"></path><path d="M9.94014 8.52404L8.37646 7.39382C5.60179 5.91001 5 9.17692 5 9.17692V11.4651L9.94014 15.0667V8.52404Z" fill="#C5221F"></path><path d="M9.94043 8.52441V15.0671L9.94811 15.0734V8.53073L9.94043 8.52441Z" fill="#C5221F"></path><path d="M5 11.4668V22.6591C5.07646 23.8904 6.15673 24.0003 6.15673 24.0003H9.94877L9.94014 15.0671L5 11.4668Z" fill="#4285F4"></path></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://www.instagram.com/suyash.jawale/"><svg width="1.97rem" height="1.97rem" viewBox="-1.6 -1.6 35.20 35.20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-1.6" y="-1.6" width="35.20" height="35.20" rx="7.04" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint0_radial_87_7153)"></rect><rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint1_radial_87_7153)"></rect><rect x="2" y="2" width="28" height="28" rx="6" fill="url(#paint2_radial_87_7153)"></rect><path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white"></path><defs><radialGradient id="paint0_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)"><stop stop-color="#B13589"></stop><stop offset="0.79309" stop-color="#C62F94"></stop><stop offset="1" stop-color="#8A3AC8"></stop></radialGradient><radialGradient id="paint1_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)"><stop stop-color="#E0E8B7"></stop><stop offset="0.444662" stop-color="#FB8A2E"></stop><stop offset="0.71474" stop-color="#E2425C"></stop><stop offset="1" stop-color="#E2425C" stop-opacity="0"></stop></radialGradient><radialGradient id="paint2_radial_87_7153" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)"><stop offset="0.156701" stop-color="#406ADC"></stop><stop offset="0.467799" stop-color="#6A45BE"></stop><stop offset="1" stop-color="#6A45BE" stop-opacity="0"></stop></radialGradient></defs></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/suyashjawale/"><svg width="1.97rem" height="1.97rem" viewBox="-1.6 -1.6 19.20 19.20" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-1.6" y="-1.6" width="19.20" height="19.20" rx="3.84" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#0A66C2" d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"></path></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://github.com/suyashjawale"><svg width="1.97rem" height="1.97rem" viewBox="0 0 73 73" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>team-collaboration/version-control/github</title><desc>Created with Sketch.</desc><defs></defs><g id="team-collaboration/version-control/github" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="container" transform="translate(2.000000, 2.000000)" fill-rule="nonzero"><rect id="mask" stroke="#ffffff" stroke-width="2" fill="#ffffff" x="-1" y="-1" width="71" height="71" rx="14"></rect><path d="M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z" id="Shape" fill="#000000"></path></g></g></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://medium.com/@suyashjawale"><svg fill="#000000" width="1.97rem" height="1.97rem" viewBox="-1.6 -1.6 35.20 35.20" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-1.6" y="-1.6" width="35.20" height="35.20" rx="7.04" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>medium</title><path d="M30.955 16c0 3.951-0.661 7.166-1.483 7.166s-1.483-3.215-1.483-7.166 0.661-7.166 1.483-7.166 1.483 3.215 1.483 7.166zM27.167 16c0 4.412-1.882 8.001-4.212 8.001s-4.225-3.589-4.225-8.001 1.894-8.001 4.225-8.001 4.212 3.589 4.212 8.001zM17.919 16c-0.014 4.67-3.803 8.45-8.475 8.45-4.68 0-8.475-3.794-8.475-8.475s3.794-8.475 8.475-8.475c2.351 0 4.479 0.957 6.014 2.504l0.001 0.001c1.521 1.531 2.46 3.641 2.46 5.97 0 0.009 0 0.018-0 0.026v-0.001z"></path></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://twitter.com/the_suyash_"><svg width="1.97rem" height="1.97rem" viewBox="-2.08 -2.08 20.16 20.16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-2.08" y="-2.08" width="20.16" height="20.16" rx="4.032" fill="#ffffff" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1D9BF0" d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z"></path></g></svg></a>  \n               <a target="_blank" rel="noreferrer" href="https://stackoverflow.com/users/9807249/suyash-jawale"><svg xmlns="http://www.w3.org/2000/svg" aria-label="Stack Overflow" role="img" viewBox="0 0 512 512" width="1.97rem" height="1.97rem" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><rect width="512" height="512" rx="15%" fill="#f58025"></rect><path stroke="#ffffff" stroke-width="30" fill="none" d="M293 89l90 120zm-53 50l115 97zm-41 65l136 64zm-23 69l148 31zm-6 68h150zm-45-44v105h241V297"></path></g></svg></a>',y=C(),k=v("div"),_=g(e[0]),L=C(),V=v("div"),S=v("progress"),$=C(),M=v("section"),G=v("div"),G.textContent="Experience",A=C(),j=v("div"),E=v("div"),z=v("h5"),z.textContent="Engineer",R=C(),T=v("div"),T.textContent="Tata Consultancy Services",D=C(),H=v("small"),P=v("div"),B=v("div"),B.textContent="Jan 2021 - Present",Z=C(),F=v("div"),O=g(e[1]),J=C(),I=v("div"),U=v("hr"),W=C(),Q=v("ul"),Q.innerHTML='<li class="my-2">Proven ability to implement machine learning and deep learning models to solve real-world problems</li> \n                     <li class="my-2">Strong understanding of natural language processing techniques, including sentiment analysis and text classification</li> \n                     <li class="my-2">2+ years of professional experience in the field of machine learning and deep learning, with a focus on natural language processing.</li> \n                     <li class="my-2">Proficient in utilizing data analysis and visualization tools, such as Python, R, and SQL.</li> \n                     <li class="my-2">Experience in the deployment of machine learning models to production environments utilizing cloud-based platforms, such as AWS and GCP.</li> \n                     <li class="my-2">Solid understanding of data management and database management systems.</li> \n                     <li class="my-2">Experience in mentoring junior team members.</li> \n                     <li class="my-2">Worked with research and development team to optimize existing algorithms and improve performance.</li>',q=C(),Y=v("div"),Y.innerHTML='<div id="liveToast" class="rounded toast fade hide shadow" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="10000"><div class="toast-header bg-custom"><svg width="26" height="26" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" stroke-width="1.5" class="h-6 w-6"><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="#00ffbf"></path></svg> \n                           <strong class="me-auto"></strong> \n                           <small>Generated by ChatGPT</small> \n                           <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div> \n                        <div class="toast-body bg-custom rounded"><div class="border border-1 rounded py-2"><div class="mx-2">Description is optimized using ChatGPT.</div></div> \n                           <div class="py-2 mx-2 fw-semibold">Query</div> \n                           <div class="border border-1 rounded py-2"><div class="mx-2">I work on machine learning , deep learning, nlp , data analysis , api development, managing databases. I also train other employees and i work with the research and development team. I have optimized existing algorithms to work faster. I have deployed many ml models to production.optimize this into bullet points for my resume</div></div></div></div>',K=C(),X=v("div"),tt=v("span"),tt.innerHTML='<span id="chatgpt">Generated by ChatGPT </span><span class="align-middle">ⓘ</span>',et=C(),it=v("div"),it.textContent="Education",st=C(),at=v("div"),at.innerHTML='<div class="card-body"><h5 class="card-title">Master In Computer Science</h5> \n               <div class="fw-semibold">Pune University</div> \n               <div><small class="fw-light">June 2020 - June 2022</small></div> \n               <div class="card-text fw-light mt-2">CGPA 9.6</div></div>',lt=C(),nt=v("section"),nt.innerHTML='<div class="fs-2 text-white ms-1 mt-2">Skills</div> \n         <small class="fw-lighter text-white ms-1">Categorized by domains.</small> \n         <div class="row"><div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Languages</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Rust</li> \n                        <li class="col-6">Python</li> \n                        <li class="col-6">Javascript</li> \n                        <li class="col-6">PHP</li> \n                        <li class="col-6">Java</li> \n                        <li class="col-6">C</li> \n                        <li class="col-6">C++</li> \n                        <li class="col-6">Golang</li> \n                        <li class="col-6">Kotlin</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Data Science</div> \n                  <div class="card-body"><div class="row"><li class="col-12">Natural Language Processing</li> \n                        <li class="col-12">Computer Vision</li> \n                        <li class="col-12">Predictive Analysis</li> \n                        <li class="col-12">Transfer Learning</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Backend</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Actix-web</li> \n                        <li class="col-6">NodeJS</li> \n                        <li class="col-6">ExpressJS</li> \n                        <li class="col-6">Fastify</li> \n                        <li class="col-6">Flask</li> \n                        <li class="col-6">Go Fiber</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Databases</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Redis</li> \n                        <li class="col-6">MongoDB</li> \n                        <li class="col-6">MySQL</li> \n                        <li class="col-6">Postgres</li> \n                        <li class="col-6">OracleDB</li> \n                        <li class="col-6">SAP Hana</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Frontend</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Svelte</li> \n                        <li class="col-6">JQuery</li> \n                        <li class="col-6">Bootstrap</li> \n                        <li class="col-12">HTML5 / Css3</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Testing &amp; Automation</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Selenium</li> \n                        <li class="col-6">Postman</li> \n                        <li class="col-12">Thunderclient</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">DevOps</div> \n                  <div class="card-body"><div class="row"><li class="col-6">Git</li> \n                        <li class="col-6">Docker</li></div></div></div></div> \n            <div class="col-sm-12 col-xs-12 col-lg-4 col-md-6 col-xl-4 col-xxl-4 d-flex align-items-stretch"><div class="card border-primary mb-3 mt-2 bg-transparent text-white w-100"><div class="card-header fw-semibold bg-transparent">Cloud Services</div> \n                  <div class="card-body"><div class="row"><li class="col-6">AWS</li> \n                        <li class="col-6">GCP</li> \n                        <li class="col-6">Azure</li> \n                        <li class="col-6">Heroku</li> \n                        <li class="col-12">Digitalocean</li></div></div></div></div></div>',rt=C(),ot=v("section"),ot.innerHTML='<div class="fs-2">Projects</div> \n         <div class="d-flex justify-content-between"><div></div> \n            <div class="input-group my-2 w-c-xl-30 w-c-lg-40 w-c-md-60 w-c-sm-100"><input type="text" class="form-control form-control-sm bg-transparent border-primary rounded-pill me-1 ps-3" placeholder="Search" aria-label="Recipient&#39;s username"/>             \n               <button class="btn btn-sm btn-primary bg-transparent rounded-pill" data-bs-toggle="modal" data-bs-target="#filterModal"><span class="px-2"><small>Filters</small> \n                  <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4 7H20M6.99994 12H16.9999M10.9999 17H12.9999" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg></span></button></div></div> \n\n \n <div class="modal fade" id="filterModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content bg-custom shadow"><div class="modal-body mx-2"><div class="fw-semibold mb-1">Domain</div> \n         <small><div class="row"><div class="col-6 my-1"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>\n                AI</div> \n            <div class="col-6 my-1"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>\n                Web</div> \n            <div class="col-6 my-1"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>\n                CLI</div> \n            <div class="col-6 my-1"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>\n                Android</div> \n            <div class="col-6 my-1"><input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>\n                Windows</div></div></small> \n      <hr/> \n   <div class="text-end"><button class="btn btn-sm btn-outline-primary text-white px-4 rounded-pill"><small class="align-top">Apply</small></button></div></div></div></div></div>',b(s,"class","navbar navbar-dark bg-transparent fixed-top"),b(o,"class","m-4"),b(d,"class","display-3 text-white"),b(p,"class","lh-lg fs-6 fw-semibold text-white"),b(x,"class","fs-4 lh-lg text-center"),b(k,"class","fs-6 fw-semibold text-white mt-2"),S.value=e[2],b(S,"class","w-100"),b(V,"class","mx-lg-5 mt-3"),b(r,"class","text-center"),b(n,"id","home"),b(n,"class","pt-5"),b(G,"class","fs-2 text-white ms-1 my-2"),b(z,"class","card-title"),b(T,"class","fw-semibold"),b(P,"class","d-flex justify-content-between"),b(H,"class","fw-light"),b(Q,"class","ps-custom"),b(Y,"class","toast-container position-fixed bottom-0 start-50 translate-middle-x p-3 "),b(tt,"type","button"),b(X,"class","text-end"),b(I,"class","card-text fw-light mt-3"),b(E,"class","card-body"),b(j,"class","card border-primary mb-3 bg-transparent text-white"),b(it,"class","fs-2 text-white ms-1 my-2"),b(at,"class","card border-primary mb-3 bg-transparent text-white"),b(M,"id","about"),b(M,"class","text-start mt-3"),b(nt,"id","skills"),b(ot,"id","projects"),b(ot,"class","my-2 text-white my-2"),b(l,"class","container mb-5")},m(t,e){var u,v,g,C;!function(t,e,i){t.insertBefore(e,i||null)}(t,i,e),m(i,s),m(i,a),m(i,l),m(l,n),m(n,r),m(r,o),m(r,c),m(r,d),m(r,f),m(r,p),m(r,h),m(r,x),m(r,y),m(r,k),m(k,_),m(r,L),m(r,V),m(V,S),m(l,$),m(l,M),m(M,G),m(M,A),m(M,j),m(j,E),m(E,z),m(E,R),m(E,T),m(E,D),m(E,H),m(H,P),m(P,B),m(P,Z),m(P,F),m(F,O),m(E,J),m(E,I),m(I,U),m(I,W),m(I,Q),m(I,q),m(I,Y),m(I,K),m(I,X),m(X,tt),m(M,et),m(M,it),m(M,st),m(M,at),m(l,lt),m(l,nt),m(l,rt),m(l,ot),ct||(v="click",g=N,(u=tt).addEventListener(v,g,C),dt=()=>u.removeEventListener(v,g,C),ct=!0)},p(t,[e]){1&e&&w(_,t[0]),4&e&&(S.value=t[2]),2&e&&w(O,t[1])},i:t,o:t,d(t){t&&u(i),ct=!1,dt()}}}function N(){let t=document.getElementById("liveToast");new bootstrap.Toast(t).show()}function J(t,e,i){let s,a="",l="",n=new Date,r=n.getFullYear(),c=n.getMonth(),d=n.getDate();const f=F(0,{duration:6e3});function p(t,e,i){let s=r-t;if(c>=e)var a=c-e;else{s--;a=12+c-e}if(d>=i)var l=d-i;else{a--;l=31+d-i;a<0&&(a=11,s--)}return[s,a,l]}return o(t,f,(t=>i(2,s=t))),k((()=>{let t=p(1999,7,3),e=p(2021,0,21);f.set(t[0]/30),i(0,a=`${t[0]} Years, ${t[1]} Months, ${t[2]} Days`),i(1,l=`${e[0]} Years, ${e[1]} Months`)})),[a,l,s,f]}return new class extends H{constructor(t){super(),D(this,t,J,O,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
