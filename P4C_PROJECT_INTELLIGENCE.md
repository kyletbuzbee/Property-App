## 1. Executive Summary
- **Total Files:** 29
- **Lines of Code:** 3239
- **High/Critical Issues:** 7


## 2. Project Structure
```text
├── prisma
│   └── schema.prisma
├── src
│   ├── app
│   │   ├── api
│   │   │   └── properties
│   │   │       └── route.ts
│   │   ├── lib
│   │   │   └── db.ts
│   │   ├── properties
│   │   │   └── [id]
│   │   │       └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── DashboardClient.tsx
│   │   ├── OpportunityMap.tsx
│   │   ├── PropertyDataTable.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StrategyKanban.tsx
│   │   └── ValueScatterPlot.tsx
│   └── data
│       └── properties.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── prisma.config.ts
├── raw-data.json
├── raw-data.txt
├── top-properties.csv
└── tsconfig.json

```


## 3. Source Code & Analysis
### 📄 `.next\static\chunks\app\layout.js`

```javascript
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["app/layout"],{

/***/ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22D%3A%5C%5CProperties4Creation%5C%5CProperty%20App%5C%5Csrc%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&server=false!":
/*!*****************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22D%3A%5C%5CProperties4Creation%5C%5CProperty%20App%5C%5Csrc%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&server=false! ***!
  \*****************************************************************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval(__webpack_require__.ts("Promise.resolve(/*! import() eager */).then(__webpack_require__.bind(__webpack_require__, /*! ./src/app/globals.css */ \"(app-pages-browser)/./src/app/globals.css\"));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtZmxpZ2h0LWNsaWVudC1lbnRyeS1sb2FkZXIuanM/bW9kdWxlcz0lN0IlMjJyZXF1ZXN0JTIyJTNBJTIyRCUzQSU1QyU1Q1Byb3BlcnRpZXM0Q3JlYXRpb24lNUMlNUNQcm9wZXJ0eSUyMEFwcCU1QyU1Q3NyYyU1QyU1Q2FwcCU1QyU1Q2dsb2JhbHMuY3NzJTIyJTJDJTIyaWRzJTIyJTNBJTVCJTVEJTdEJnNlcnZlcj1mYWxzZSEiLCJtYXBwaW5ncyI6IkFBQUEsb0tBQWlHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8/Zjg1ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQoLyogd2VicGFja01vZGU6IFwiZWFnZXJcIiAqLyBcIkQ6XFxcXFByb3BlcnRpZXM0Q3JlYXRpb25cXFxcUHJvcGVydHkgQXBwXFxcXHNyY1xcXFxhcHBcXFxcZ2xvYmFscy5jc3NcIik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22D%3A%5C%5CProperties4Creation%5C%5CProperty%20App%5C%5Csrc%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&server=false!\n"));

/***/ }),

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"19aebd77c02c\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvZ2xvYmFscy5jc3M/NDc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjE5YWViZDc3YzAyY1wiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, ["main-app"], function() { return __webpack_exec__("(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22D%3A%5C%5CProperties4Creation%5C%5CProperty%20App%5C%5Csrc%5C%5Capp%5C%5Cglobals.css%22%2C%22ids%22%3A%5B%5D%7D&server=false!"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);
```

---
### 📄 `.next\static\chunks\polyfills.js`

```javascript
!function(){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function e(t){var e={exports:{}};return t(e,e.exports),e.exports}var r,n,o=function(t){return t&&t.Math===Math&&t},i=o("object"==typeof globalThis&&globalThis)||o("object"==typeof window&&window)||o("object"==typeof self&&self)||o("object"==typeof t&&t)||o("object"==typeof t&&t)||function(){return this}()||Function("return this")(),a=function(t){try{return!!t()}catch(t){return!0}},u=!a(function(){return 7!==Object.defineProperty({},1,{get:function(){return 7}})[1]}),s=!a(function(){var t=function(){}.bind();return"function"!=typeof t||t.hasOwnProperty("prototype")}),c=Function.prototype.call,f=s?c.bind(c):function(){return c.apply(c,arguments)},l={}.propertyIsEnumerable,h=Object.getOwnPropertyDescriptor,p=h&&!l.call({1:2},1)?function(t){var e=h(this,t);return!!e&&e.enumerable}:l,v={f:p},d=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},g=Function.prototype,y=g.call,m=s&&g.bind.bind(y,y),b=s?m:function(t){return function(){return y.apply(t,arguments)}},w=b({}.toString),S=b("".slice),E=function(t){return S(w(t),8,-1)},O=Object,x=b("".split),R=a(function(){return!O("z").propertyIsEnumerable(0)})?function(t){return"String"===E(t)?x(t,""):O(t)}:O,P=function(t){return null==t},A=TypeError,j=function(t){if(P(t))throw new A("Can't call method on "+t);return t},k=function(t){return R(j(t))},I="object"==typeof document&&document.all,T=void 0===I&&void 0!==I?function(t){return"function"==typeof t||t===I}:function(t){return"function"==typeof t},M=function(t){return"object"==typeof t?null!==t:T(t)},L=function(t,e){return arguments.length<2?T(r=i[t])?r:void 0:i[t]&&i[t][e];var r},U=b({}.isPrototypeOf),N=i.navigator,C=N&&N.userAgent,_=C?String(C):"",F=i.process,B=i.Deno,D=F&&F.versions||B&&B.version,z=D&&D.v8;z&&(n=(r=z.split("."))[0]>0&&r[0]<4?1:+(r[0]+r[1])),!n&&_&&(!(r=_.match(/Edge\/(\d+)/))||r[1]>=74)&&(r=_.match(/Chrome\/(\d+)/))&&(n=+r[1]);var W=n,q=i.String,H=!!Object.getOwnPropertySymbols&&!a(function(){var t=Symbol("symbol detection");return!q(t)||!(Object(t)instanceof Symbol)||!Symbol.sham&&W&&W<41}),$=H&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,K=Object,G=$?function(t){return"symbol"==typeof t}:function(t){var e=L("Symbol");return T(e)&&U(e.prototype,K(t))},V=String,Y=function(t){try{return V(t)}catch(t){return"Object"}},X=TypeError,J=function(t){if(T(t))return t;throw new X(Y(t)+" is not a function")},Q=function(t,e){var r=t[e];return P(r)?void 0:J(r)},Z=TypeError,tt=Object.defineProperty,et=function(t,e){try{tt(i,t,{value:e,configurable:!0,writable:!0})}catch(r){i[t]=e}return e},rt=e(function(t){var e="__core-js_shared__",r=t.exports=i[e]||et(e,{});(r.versions||(r.versions=[])).push({version:"3.38.1",mode:"global",copyright:"© 2014-2024 Denis Pushkarev (zloirock.ru)",license:"https://github.com/zloirock/core-js/blob/v3.38.1/LICENSE",source:"https://github.com/zloirock/core-js"})}),nt=function(t,e){return rt[t]||(rt[t]=e||{})},ot=Object,it=function(t){return ot(j(t))},at=b({}.hasOwnProperty),ut=Object.hasOwn||function(t,e){return at(it(t),e)},st=0,ct=Math.random(),ft=b(1..toString),lt=function(t){return"Symbol("+(void 0===t?"":t)+")_"+ft(++st+ct,36)},ht=i.Symbol,pt=nt("wks"),vt=$?ht.for||ht:ht&&ht.withoutSetter||lt,dt=function(t){return ut(pt,t)||(pt[t]=H&&ut(ht,t)?ht[t]:vt("Symbol."+t)),pt[t]},gt=TypeError,yt=dt("toPrimitive"),mt=function(t,e){if(!M(t)||G(t))return t;var r,n=Q(t,yt);if(n){if(void 0===e&&(e="default"),r=f(n,t,e),!M(r)||G(r))return r;throw new gt("Can't convert object to primitive value")}return void 0===e&&(e="number"),function(t,e){var r,n;if("string"===e&&T(r=t.toString)&&!M(n=f(r,t)))return n;if(T(r=t.valueOf)&&!M(n=f(r,t)))return n;if("string"!==e&&T(r=t.toString)&&!M(n=f(r,t)))return n;throw new Z("Can't convert object to primitive value")}(t,e)},bt=function(t){var e=mt(t,"string");return G(e)?e:e+""},wt=i.document,St=M(wt)&&M(wt.createElement),Et=function(t){return St?wt.createElement(t):{}},Ot=!u&&!a(function(){return 7!==Object.defineProperty(Et("div"),"a",{get:function(){return 7}}).a}),xt=Object.getOwnPropertyDescriptor,Rt={f:u?xt:function(t,e){if(t=k(t),e=bt(e),Ot)try{return xt(t,e)}catch(t){}if(ut(t,e))return d(!f(v.f,t,e),t[e])}},Pt=u&&a(function(){return 42!==Object.defineProperty(function(){},"prototype",{value:42,writable:!1}).prototype}),At=String,jt=TypeError,kt=function(t){if(M(t))return t;throw new jt(At(t)+" is not an object")},It=TypeError,Tt=Object.defineProperty,Mt=Object.getOwnPropertyDescriptor,Lt="enumerable",Ut="configurable",Nt="writable",Ct={f:u?Pt?function(t,e,r){if(kt(t),e=bt(e),kt(r),"function"==typeof t&&"prototype"===e&&"value"in r&&Nt in r&&!r[Nt]){var n=Mt(t,e);n&&n[Nt]&&(t[e]=r.value,r={configurable:Ut in r?r[Ut]:n[Ut],enumerable:Lt in r?r[Lt]:n[Lt],writable:!1})}return Tt(t,e,r)}:Tt:function(t,e,r){if(kt(t),e=bt(e),kt(r),Ot)try{return Tt(t,e,r)}catch(t){}if("get"in r||"set"in r)throw new It("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},_t=u?function(t,e,r){return Ct.f(t,e,d(1,r))}:function(t,e,r){return t[e]=r,t},Ft=Function.prototype,Bt=u&&Object.getOwnPropertyDescriptor,Dt=ut(Ft,"name"),zt={EXISTS:Dt,PROPER:Dt&&"something"===function(){}.name,CONFIGURABLE:Dt&&(!u||u&&Bt(Ft,"name").configurable)},Wt=b(Function.toString);T(rt.inspectSource)||(rt.inspectSource=function(t){return Wt(t)});var qt,Ht,$t,Kt=rt.inspectSource,Gt=i.WeakMap,Vt=T(Gt)&&/native code/.test(String(Gt)),Yt=nt("keys"),Xt=function(t){return Yt[t]||(Yt[t]=lt(t))},Jt={},Qt="Object already initialized",Zt=i.TypeError;if(Vt||rt.state){var te=rt.state||(rt.state=new(0,i.WeakMap));te.get=te.get,te.has=te.has,te.set=te.set,qt=function(t,e){if(te.has(t))throw new Zt(Qt);return e.facade=t,te.set(t,e),e},Ht=function(t){return te.get(t)||{}},$t=function(t){return te.has(t)}}else{var ee=Xt("state");Jt[ee]=!0,qt=function(t,e){if(ut(t,ee))throw new Zt(Qt);return e.facade=t,_t(t,ee,e),e},Ht=function(t){return ut(t,ee)?t[ee]:{}},$t=function(t){return ut(t,ee)}}var re,ne={set:qt,get:Ht,has:$t,enforce:function(t){return $t(t)?Ht(t):qt(t,{})},getterFor:function(t){return function(e){var r;if(!M(e)||(r=Ht(e)).type!==t)throw new Zt("Incompatible receiver, "+t+" required");return r}}},oe=e(function(t){var e=zt.CONFIGURABLE,r=ne.enforce,n=ne.get,o=String,i=Object.defineProperty,s=b("".slice),c=b("".replace),f=b([].join),l=u&&!a(function(){return 8!==i(function(){},"length",{value:8}).length}),h=String(String).split("String"),p=t.exports=function(t,n,a){"Symbol("===s(o(n),0,7)&&(n="["+c(o(n),/^Symbol\(([^)]*)\).*$/,"$1")+"]"),a&&a.getter&&(n="get "+n),a&&a.setter&&(n="set "+n),(!ut(t,"name")||e&&t.name!==n)&&(u?i(t,"name",{value:n,configurable:!0}):t.name=n),l&&a&&ut(a,"arity")&&t.length!==a.arity&&i(t,"length",{value:a.arity});try{a&&ut(a,"constructor")&&a.constructor?u&&i(t,"prototype",{writable:!1}):t.prototype&&(t.prototype=void 0)}catch(t){}var p=r(t);return ut(p,"source")||(p.source=f(h,"string"==typeof n?n:"")),t};Function.prototype.toString=p(function(){return T(this)&&n(this).source||Kt(this)},"toString")}),ie=function(t,e,r,n){n||(n={});var o=n.enumerable,i=void 0!==n.name?n.name:e;if(T(r)&&oe(r,i,n),n.global)o?t[e]=r:et(e,r);else{try{n.unsafe?t[e]&&(o=!0):delete t[e]}catch(t){}o?t[e]=r:Ct.f(t,e,{value:r,enumerable:!1,configurable:!n.nonConfigurable,writable:!n.nonWritable})}return t},ae=Math.ceil,ue=Math.floor,se=Math.trunc||function(t){var e=+t;return(e>0?ue:ae)(e)},ce=function(t){var e=+t;return e!=e||0===e?0:se(e)},fe=Math.max,le=Math.min,he=function(t,e){var r=ce(t);return r<0?fe(r+e,0):le(r,e)},pe=Math.min,ve=function(t){var e=ce(t);return e>0?pe(e,9007199254740991):0},de=function(t){return ve(t.length)},ge=function(t){return function(e,r,n){var o=k(e),i=de(o);if(0===i)return!t&&-1;var a,u=he(n,i);if(t&&r!=r){for(;i>u;)if((a=o[u++])!=a)return!0}else for(;i>u;u++)if((t||u in o)&&o[u]===r)return t||u||0;return!t&&-1}},ye={includes:ge(!0),indexOf:ge(!1)},me=ye.indexOf,be=b([].push),we=function(t,e){var r,n=k(t),o=0,i=[];for(r in n)!ut(Jt,r)&&ut(n,r)&&be(i,r);for(;e.length>o;)ut(n,r=e[o++])&&(~me(i,r)||be(i,r));return i},Se=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Ee=Se.concat("length","prototype"),Oe={f:Object.getOwnPropertyNames||function(t){return we(t,Ee)}},xe={f:Object.getOwnPropertySymbols},Re=b([].concat),Pe=L("Reflect","ownKeys")||function(t){var e=Oe.f(kt(t)),r=xe.f;return r?Re(e,r(t)):e},Ae=function(t,e,r){for(var n=Pe(e),o=Ct.f,i=Rt.f,a=0;a<n.length;a++){var u=n[a];ut(t,u)||r&&ut(r,u)||o(t,u,i(e,u))}},je=/#|\.prototype\./,ke=function(t,e){var r=Te[Ie(t)];return r===Le||r!==Me&&(T(e)?a(e):!!e)},Ie=ke.normalize=function(t){return String(t).replace(je,".").toLowerCase()},Te=ke.data={},Me=ke.NATIVE="N",Le=ke.POLYFILL="P",Ue=ke,Ne=Rt.f,Ce=function(t,e){var r,n,o,a,u,s=t.target,c=t.global,f=t.stat;if(r=c?i:f?i[s]||et(s,{}):i[s]&&i[s].prototype)for(n in e){if(a=e[n],o=t.dontCallGetSet?(u=Ne(r,n))&&u.value:r[n],!Ue(c?n:s+(f?".":"#")+n,t.forced)&&void 0!==o){if(typeof a==typeof o)continue;Ae(a,o)}(t.sham||o&&o.sham)&&_t(a,"sham",!0),ie(r,n,a,t)}},_e=Object.keys||function(t){return we(t,Se)},Fe=u&&!Pt?Object.defineProperties:function(t,e){kt(t);for(var r,n=k(e),o=_e(e),i=o.length,a=0;i>a;)Ct.f(t,r=o[a++],n[r]);return t},Be={f:Fe},De=L("document","documentElement"),ze="prototype",We="script",qe=Xt("IE_PROTO"),He=function(){},$e=function(t){return"<"+We+">"+t+"</"+We+">"},Ke=function(t){t.write($e("")),t.close();var e=t.parentWindow.Object;return t=null,e},Ge=function(){try{re=new ActiveXObject("htmlfile")}catch(t){}var t,e,r;Ge="undefined"!=typeof document?document.domain&&re?Ke(re):(e=Et("iframe"),r="java"+We+":",e.style.display="none",De.appendChild(e),e.src=String(r),(t=e.contentWindow.document).open(),t.write($e("document.F=Object")),t.close(),t.F):Ke(re);for(var n=Se.length;n--;)delete Ge[ze][Se[n]];return Ge()};Jt[qe]=!0;var Ve=Object.create||function(t,e){var r;return null!==t?(He[ze]=kt(t),r=new He,He[ze]=null,r[qe]=t):r=Ge(),void 0===e?r:Be.f(r,e)},Ye=Ct.f,Xe=dt("unscopables"),Je=Array.prototype;void 0===Je[Xe]&&Ye(Je,Xe,{configurable:!0,value:Ve(null)});var Qe=function(t){Je[Xe][t]=!0};Ce({target:"Array",proto:!0},{at:function(t){var e=it(this),r=de(e),n=ce(t),o=n>=0?n:r+n;return o<0||o>=r?void 0:e[o]}}),Qe("at");var Ze=function(t,e){return b(i[t].prototype[e])},tr=(Ze("Array","at"),TypeError),er=function(t,e){if(!delete t[e])throw new tr("Cannot delete property "+Y(e)+" of "+Y(t))},rr=Math.min,nr=[].copyWithin||function(t,e){var r=it(this),n=de(r),o=he(t,n),i=he(e,n),a=arguments.length>2?arguments[2]:void 0,u=rr((void 0===a?n:he(a,n))-i,n-o),s=1;for(i<o&&o<i+u&&(s=-1,i+=u-1,o+=u-1);u-- >0;)i in r?r[o]=r[i]:er(r,o),o+=s,i+=s;return r};Ce({target:"Array",proto:!0},{copyWithin:nr}),Qe("copyWithin"),Ze("Array","copyWithin"),Ce({target:"Array",proto:!0},{fill:function(t){for(var e=it(this),r=de(e),n=arguments.length,o=he(n>1?arguments[1]:void 0,r),i=n>2?arguments[2]:void 0,a=void 0===i?r:he(i,r);a>o;)e[o++]=t;return e}}),Qe("fill"),Ze("Array","fill");var or=function(t){if("Function"===E(t))return b(t)},ir=or(or.bind),ar=function(t,e){return J(t),void 0===e?t:s?ir(t,e):function(){return t.apply(e,arguments)}},ur=Array.isArray||function(t){return"Array"===E(t)},sr={};sr[dt("toStringTag")]="z";var cr="[object z]"===String(sr),fr=dt("toStringTag"),lr=Object,hr="Arguments"===E(function(){return arguments}()),pr=cr?E:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=lr(t),fr))?r:hr?E(e):"Object"===(n=E(e))&&T(e.callee)?"Arguments":n},vr=function(){},dr=L("Reflect","construct"),gr=/^\s*(?:class|function)\b/,yr=b(gr.exec),mr=!gr.test(vr),br=function(t){if(!T(t))return!1;try{return dr(vr,[],t),!0}catch(t){return!1}},wr=function(t){if(!T(t))return!1;switch(pr(t)){case"AsyncFunction":case"GeneratorFunction":case"AsyncGeneratorFunction":return!1}try{return mr||!!yr(gr,Kt(t))}catch(t){return!0}};wr.sham=!0;var Sr=!dr||a(function(){var t;return br(br.call)||!br(Object)||!br(function(){t=!0})||t})?wr:br,Er=dt("species"),Or=Array,xr=function(t,e){return new(function(t){var e;return ur(t)&&(Sr(e=t.constructor)&&(e===Or||ur(e.prototype))||M(e)&&null===(e=e[Er]))&&(e=void 0),void 0===e?Or:e}(t))(0===e?0:e)},Rr=b([].push),Pr=function(t){var e=1===t,r=2===t,n=3===t,o=4===t,i=6===t,a=7===t,u=5===t||i;return function(s,c,f,l){for(var h,p,v=it(s),d=R(v),g=de(d),y=ar(c,f),m=0,b=l||xr,w=e?b(s,g):r||a?b(s,0):void 0;g>m;m++)if((u||m in d)&&(p=y(h=d[m],m,v),t))if(e)w[m]=p;else if(p)switch(t){case 3:return!0;case 5:return h;case 6:return m;case 2:Rr(w,h)}else switch(t){case 4:return!1;case 7:Rr(w,h)}return i?-1:n||o?o:w}},Ar={forEach:Pr(0),map:Pr(1),filter:Pr(2),some:Pr(3),every:Pr(4),find:Pr(5),findIndex:Pr(6),filterReject:Pr(7)},jr=Ar.find,kr="find",Ir=!0;kr in[]&&Array(1)[kr](function(){Ir=!1}),Ce({target:"Array",proto:!0,forced:Ir},{find:function(t){return jr(this,t,arguments.length>1?arguments[1]:void 0)}}),Qe(kr),Ze("Array","find");var Tr=Ar.findIndex,Mr="findIndex",Lr=!0;Mr in[]&&Array(1)[Mr](function(){Lr=!1}),Ce({target:"Array",proto:!0,forced:Lr},{findIndex:function(t){return Tr(this,t,arguments.length>1?arguments[1]:void 0)}}),Qe(Mr),Ze("Array","findIndex");var Ur=TypeError,Nr=function(t){if(t>9007199254740991)throw Ur("Maximum allowed index exceeded");return t},Cr=function(t,e,r,n,o,i,a,u){for(var s,c,f=o,l=0,h=!!a&&ar(a,u);l<n;)l in r&&(s=h?h(r[l],l,e):r[l],i>0&&ur(s)?(c=de(s),f=Cr(t,e,s,c,f,i-1)-1):(Nr(f+1),t[f]=s),f++),l++;return f},_r=Cr;Ce({target:"Array",proto:!0},{flatMap:function(t){var e,r=it(this),n=de(r);return J(t),(e=xr(r,0)).length=_r(e,r,r,n,0,1,t,arguments.length>1?arguments[1]:void 0),e}}),Qe("flatMap"),Ze("Array","flatMap"),Ce({target:"Array",proto:!0},{flat:function(){var t=arguments.length?arguments[0]:void 0,e=it(this),r=de(e),n=xr(e,0);return n.length=_r(n,e,e,r,0,void 0===t?1:ce(t)),n}}),Qe("flat"),Ze("Array","flat");var Fr,Br,Dr,zr=String,Wr=function(t){if("Symbol"===pr(t))throw new TypeError("Cannot convert a Symbol value to a string");return zr(t)},qr=b("".charAt),Hr=b("".charCodeAt),$r=b("".slice),Kr=function(t){return function(e,r){var n,o,i=Wr(j(e)),a=ce(r),u=i.length;return a<0||a>=u?t?"":void 0:(n=Hr(i,a))<55296||n>56319||a+1===u||(o=Hr(i,a+1))<56320||o>57343?t?qr(i,a):n:t?$r(i,a,a+2):o-56320+(n-55296<<10)+65536}},Gr={codeAt:Kr(!1),charAt:Kr(!0)},Vr=!a(function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}),Yr=Xt("IE_PROTO"),Xr=Object,Jr=Xr.prototype,Qr=Vr?Xr.getPrototypeOf:function(t){var e=it(t);if(ut(e,Yr))return e[Yr];var r=e.constructor;return T(r)&&e instanceof r?r.prototype:e instanceof Xr?Jr:null},Zr=dt("iterator"),tn=!1;[].keys&&("next"in(Dr=[].keys())?(Br=Qr(Qr(Dr)))!==Object.prototype&&(Fr=Br):tn=!0);var en=!M(Fr)||a(function(){var t={};return Fr[Zr].call(t)!==t});en&&(Fr={}),T(Fr[Zr])||ie(Fr,Zr,function(){return this});var rn={IteratorPrototype:Fr,BUGGY_SAFARI_ITERATORS:tn},nn=Ct.f,on=dt("toStringTag"),an=function(t,e,r){t&&!r&&(t=t.prototype),t&&!ut(t,on)&&nn(t,on,{configurable:!0,value:e})},un={},sn=rn.IteratorPrototype,cn=function(){return this},fn=function(t,e,r,n){var o=e+" Iterator";return t.prototype=Ve(sn,{next:d(+!n,r)}),an(t,o,!1),un[o]=cn,t},ln=function(t,e,r){try{return b(J(Object.getOwnPropertyDescriptor(t,e)[r]))}catch(t){}},hn=String,pn=TypeError,vn=function(t){if(function(t){return M(t)||null===t}(t))return t;throw new pn("Can't set "+hn(t)+" as a prototype")},dn=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=ln(Object.prototype,"__proto__","set"))(r,[]),e=r instanceof Array}catch(t){}return function(r,n){return j(r),vn(n),M(r)?(e?t(r,n):r.__proto__=n,r):r}}():void 0),gn=zt.PROPER,yn=zt.CONFIGURABLE,mn=rn.IteratorPrototype,bn=rn.BUGGY_SAFARI_ITERATORS,wn=dt("iterator"),Sn="keys",En="values",On="entries",xn=function(){return this},Rn=function(t,e,r,n,o,i,a){fn(r,e,n);var u,s,c,l=function(t){if(t===o&&g)return g;if(!bn&&t&&t in v)return v[t];switch(t){case Sn:case En:case On:return function(){return new r(this,t)}}return function(){return new r(this)}},h=e+" Iterator",p=!1,v=t.prototype,d=v[wn]||v["@@iterator"]||o&&v[o],g=!bn&&d||l(o),y="Array"===e&&v.entries||d;if(y&&(u=Qr(y.call(new t)))!==Object.prototype&&u.next&&(Qr(u)!==mn&&(dn?dn(u,mn):T(u[wn])||ie(u,wn,xn)),an(u,h,!0)),gn&&o===En&&d&&d.name!==En&&(yn?_t(v,"name",En):(p=!0,g=function(){return f(d,this)})),o)if(s={values:l(En),keys:i?g:l(Sn),entries:l(On)},a)for(c in s)(bn||p||!(c in v))&&ie(v,c,s[c]);else Ce({target:e,proto:!0,forced:bn||p},s);return v[wn]!==g&&ie(v,wn,g,{name:o}),un[e]=g,s},Pn=function(t,e){return{value:t,done:e}},An=Gr.charAt,jn="String Iterator",kn=ne.set,In=ne.getterFor(jn);Rn(String,"String",function(t){kn(this,{type:jn,string:Wr(t),index:0})},function(){var t,e=In(this),r=e.string,n=e.index;return n>=r.length?Pn(void 0,!0):(t=An(r,n),e.index+=t.length,Pn(t,!1))});var Tn=function(t,e,r){var n,o;kt(t);try{if(!(n=Q(t,"return"))){if("throw"===e)throw r;return r}n=f(n,t)}catch(t){o=!0,n=t}if("throw"===e)throw r;if(o)throw n;return kt(n),r},Mn=function(t,e,r,n){try{return n?e(kt(r)[0],r[1]):e(r)}catch(e){Tn(t,"throw",e)}},Ln=dt("iterator"),Un=Array.prototype,Nn=function(t){return void 0!==t&&(un.Array===t||Un[Ln]===t)},Cn=function(t,e,r){u?Ct.f(t,e,d(0,r)):t[e]=r},_n=dt("iterator"),Fn=function(t){if(!P(t))return Q(t,_n)||Q(t,"@@iterator")||un[pr(t)]},Bn=TypeError,Dn=function(t,e){var r=arguments.length<2?Fn(t):e;if(J(r))return kt(f(r,t));throw new Bn(Y(t)+" is not iterable")},zn=Array,Wn=function(t){var e=it(t),r=Sr(this),n=arguments.length,o=n>1?arguments[1]:void 0,i=void 0!==o;i&&(o=ar(o,n>2?arguments[2]:void 0));var a,u,s,c,l,h,p=Fn(e),v=0;if(!p||this===zn&&Nn(p))for(a=de(e),u=r?new this(a):zn(a);a>v;v++)h=i?o(e[v],v):e[v],Cn(u,v,h);else for(u=r?new this:[],l=(c=Dn(e,p)).next;!(s=f(l,c)).done;v++)h=i?Mn(c,o,[s.value,v],!0):s.value,Cn(u,v,h);return u.length=v,u},qn=dt("iterator"),Hn=!1;try{var $n=0,Kn={next:function(){return{done:!!$n++}},return:function(){Hn=!0}};Kn[qn]=function(){return this},Array.from(Kn,function(){throw 2})}catch(t){}var Gn=function(t,e){try{if(!e&&!Hn)return!1}catch(t){return!1}var r=!1;try{var n={};n[qn]=function(){return{next:function(){return{done:r=!0}}}},t(n)}catch(t){}return r},Vn=!Gn(function(t){Array.from(t)});Ce({target:"Array",stat:!0,forced:Vn},{from:Wn});var Yn=i,Xn=ye.includes,Jn=a(function(){return!Array(1).includes()});Ce({target:"Array",proto:!0,forced:Jn},{includes:function(t){return Xn(this,t,arguments.length>1?arguments[1]:void 0)}}),Qe("includes"),Ze("Array","includes");var Qn=Ct.f,Zn="Array Iterator",to=ne.set,eo=ne.getterFor(Zn),ro=Rn(Array,"Array",function(t,e){to(this,{type:Zn,target:k(t),index:0,kind:e})},function(){var t=eo(this),e=t.target,r=t.index++;if(!e||r>=e.length)return t.target=null,Pn(void 0,!0);switch(t.kind){case"keys":return Pn(r,!1);case"values":return Pn(e[r],!1)}return Pn([r,e[r]],!1)},"values"),no=un.Arguments=un.Array;if(Qe("keys"),Qe("values"),Qe("entries"),u&&"values"!==no.name)try{Qn(no,"name",{value:"values"})}catch(t){}cr||ie(Object.prototype,"toString",cr?{}.toString:function(){return"[object "+pr(this)+"]"},{unsafe:!0}),Ze("Array","values");var oo=Array,io=a(function(){function t(){}return!(oo.of.call(t)instanceof t)});Ce({target:"Array",stat:!0,forced:io},{of:function(){for(var t=0,e=arguments.length,r=new(Sr(this)?this:oo)(e);e>t;)Cn(r,t,arguments[t++]);return r.length=e,r}});var ao=dt("hasInstance"),uo=Function.prototype;ao in uo||Ct.f(uo,ao,{value:oe(function(t){if(!T(this)||!M(t))return!1;var e=this.prototype;return M(e)?U(e,t):t instanceof this},ao)}),dt("hasInstance");var so=function(t,e,r){return r.get&&oe(r.get,e,{getter:!0}),r.set&&oe(r.set,e,{setter:!0}),Ct.f(t,e,r)},co=zt.EXISTS,fo=Function.prototype,lo=b(fo.toString),ho=/function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,po=b(ho.exec);u&&!co&&so(fo,"name",{configurable:!0,get:function(){try{return po(ho,lo(this))[1]}catch(t){return""}}});var vo=b([].slice),go=Oe.f,yo="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],mo={f:function(t){return yo&&"Window"===E(t)?function(t){try{return go(t)}catch(t){return vo(yo)}}(t):go(k(t))}},bo=a(function(){if("function"==typeof ArrayBuffer){var t=new ArrayBuffer(8);Object.isExtensible(t)&&Object.defineProperty(t,"a",{value:8})}}),wo=Object.isExtensible,So=a(function(){wo(1)})||bo?function(t){return!!M(t)&&(!bo||"ArrayBuffer"!==E(t))&&(!wo||wo(t))}:wo,Eo=!a(function(){return Object.isExtensible(Object.preventExtensions({}))}),Oo=e(function(t){var e=Ct.f,r=!1,n=lt("meta"),o=0,i=function(t){e(t,n,{value:{objectID:"O"+o++,weakData:{}}})},a=t.exports={enable:function(){a.enable=function(){},r=!0;var t=Oe.f,e=b([].splice),o={};o[n]=1,t(o).length&&(Oe.f=function(r){for(var o=t(r),i=0,a=o.length;i<a;i++)if(o[i]===n){e(o,i,1);break}return o},Ce({target:"Object",stat:!0,forced:!0},{getOwnPropertyNames:mo.f}))},fastKey:function(t,e){if(!M(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!ut(t,n)){if(!So(t))return"F";if(!e)return"E";i(t)}return t[n].objectID},getWeakData:function(t,e){if(!ut(t,n)){if(!So(t))return!0;if(!e)return!1;i(t)}return t[n].weakData},onFreeze:function(t){return Eo&&r&&So(t)&&!ut(t,n)&&i(t),t}};Jt[n]=!0}),xo=TypeError,Ro=function(t,e){this.stopped=t,this.result=e},Po=Ro.prototype,Ao=function(t,e,r){var n,o,i,a,u,s,c,l=!(!r||!r.AS_ENTRIES),h=!(!r||!r.IS_RECORD),p=!(!r||!r.IS_ITERATOR),v=!(!r||!r.INTERRUPTED),d=ar(e,r&&r.that),g=function(t){return n&&Tn(n,"normal",t),new Ro(!0,t)},y=function(t){return l?(kt(t),v?d(t[0],t[1],g):d(t[0],t[1])):v?d(t,g):d(t)};if(h)n=t.iterator;else if(p)n=t;else{if(!(o=Fn(t)))throw new xo(Y(t)+" is not iterable");if(Nn(o)){for(i=0,a=de(t);a>i;i++)if((u=y(t[i]))&&U(Po,u))return u;return new Ro(!1)}n=Dn(t,o)}for(s=h?t.next:n.next;!(c=f(s,n)).done;){try{u=y(c.value)}catch(t){Tn(n,"throw",t)}if("object"==typeof u&&u&&U(Po,u))return u}return new Ro(!1)},jo=TypeError,ko=function(t,e){if(U(e,t))return t;throw new jo("Incorrect invocation")},Io=function(t,e,r){var n,o;return dn&&T(n=e.constructor)&&n!==r&&M(o=n.prototype)&&o!==r.prototype&&dn(t,o),t},To=function(t,e,r){var n=-1!==t.indexOf("Map"),o=-1!==t.indexOf("Weak"),u=n?"set":"add",s=i[t],c=s&&s.prototype,f=s,l={},h=function(t){var e=b(c[t]);ie(c,t,"add"===t?function(t){return e(this,0===t?0:t),this}:"delete"===t?function(t){return!(o&&!M(t))&&e(this,0===t?0:t)}:"get"===t?function(t){return o&&!M(t)?void 0:e(this,0===t?0:t)}:"has"===t?function(t){return!(o&&!M(t))&&e(this,0===t?0:t)}:function(t,r){return e(this,0===t?0:t,r),this})};if(Ue(t,!T(s)||!(o||c.forEach&&!a(function(){(new s).entries().next()}))))f=r.getConstructor(e,t,n,u),Oo.enable();else if(Ue(t,!0)){var p=new f,v=p[u](o?{}:-0,1)!==p,d=a(function(){p.has(1)}),g=Gn(function(t){new s(t)}),y=!o&&a(function(){for(var t=new s,e=5;e--;)t[u](e,e);return!t.has(-0)});g||((f=e(function(t,e){ko(t,c);var r=Io(new s,t,f);return P(e)||Ao(e,r[u],{that:r,AS_ENTRIES:n}),r})).prototype=c,c.constructor=f),(d||y)&&(h("delete"),h("has"),n&&h("get")),(y||v)&&h(u),o&&c.clear&&delete c.clear}return l[t]=f,Ce({global:!0,constructor:!0,forced:f!==s},l),an(f,t),o||r.setStrong(f,t,n),f},Mo=function(t,e,r){for(var n in e)ie(t,n,e[n],r);return t},Lo=dt("species"),Uo=function(t){var e=L(t);u&&e&&!e[Lo]&&so(e,Lo,{configurable:!0,get:function(){return this}})},No=Oo.fastKey,Co=ne.set,_o=ne.getterFor,Fo={getConstructor:function(t,e,r,n){var o=t(function(t,o){ko(t,i),Co(t,{type:e,index:Ve(null),first:null,last:null,size:0}),u||(t.size=0),P(o)||Ao(o,t[n],{that:t,AS_ENTRIES:r})}),i=o.prototype,a=_o(e),s=function(t,e,r){var n,o,i=a(t),s=c(t,e);return s?s.value=r:(i.last=s={index:o=No(e,!0),key:e,value:r,previous:n=i.last,next:null,removed:!1},i.first||(i.first=s),n&&(n.next=s),u?i.size++:t.size++,"F"!==o&&(i.index[o]=s)),t},c=function(t,e){var r,n=a(t),o=No(e);if("F"!==o)return n.index[o];for(r=n.first;r;r=r.next)if(r.key===e)return r};return Mo(i,{clear:function(){for(var t=a(this),e=t.first;e;)e.removed=!0,e.previous&&(e.previous=e.previous.next=null),e=e.next;t.first=t.last=null,t.index=Ve(null),u?t.size=0:this.size=0},delete:function(t){var e=this,r=a(e),n=c(e,t);if(n){var o=n.next,i=n.previous;delete r.index[n.index],n.removed=!0,i&&(i.next=o),o&&(o.previous=i),r.first===n&&(r.first=o),r.last===n&&(r.last=i),u?r.size--:e.size--}return!!n},forEach:function(t){for(var e,r=a(this),n=ar(t,arguments.length>1?arguments[1]:void 0);e=e?e.next:r.first;)for(n(e.value,e.key,this);e&&e.removed;)e=e.previous},has:function(t){return!!c(this,t)}}),Mo(i,r?{get:function(t){var e=c(this,t);return e&&e.value},set:function(t,e){return s(this,0===t?0:t,e)}}:{add:function(t){return s(this,t=0===t?0:t,t)}}),u&&so(i,"size",{configurable:!0,get:function(){return a(this).size}}),o},setStrong:function(t,e,r){var n=e+" Iterator",o=_o(e),i=_o(n);Rn(t,e,function(t,e){Co(this,{type:n,target:t,state:o(t),kind:e,last:null})},function(){for(var t=i(this),e=t.kind,r=t.last;r&&r.removed;)r=r.previous;return t.target&&(t.last=r=r?r.next:t.state.first)?Pn("keys"===e?r.key:"values"===e?r.value:[r.key,r.value],!1):(t.target=null,Pn(void 0,!0))},r?"entries":"values",!r,!0),Uo(e)}};To("Map",function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},Fo);var Bo=Map.prototype,Do={Map:Map,set:b(Bo.set),get:b(Bo.get),has:b(Bo.has),remove:b(Bo.delete),proto:Bo},zo=Do.Map,Wo=Do.has,qo=Do.get,Ho=Do.set,$o=b([].push),Ko=a(function(){return 1!==zo.groupBy("ab",function(t){return t}).get("a").length});Ce({target:"Map",stat:!0,forced:Ko},{groupBy:function(t,e){j(t),J(e);var r=new zo,n=0;return Ao(t,function(t){var o=e(t,n++);Wo(r,o)?$o(qo(r,o),t):Ho(r,o,[t])}),r}});var Go={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},Vo=Et("span").classList,Yo=Vo&&Vo.constructor&&Vo.constructor.prototype,Xo=Yo===Object.prototype?void 0:Yo,Jo=dt("iterator"),Qo=ro.values,Zo=function(t,e){if(t){if(t[Jo]!==Qo)try{_t(t,Jo,Qo)}catch(e){t[Jo]=Qo}if(an(t,e,!0),Go[e])for(var r in ro)if(t[r]!==ro[r])try{_t(t,r,ro[r])}catch(e){t[r]=ro[r]}}};for(var ti in Go)Zo(i[ti]&&i[ti].prototype,ti);Zo(Xo,"DOMTokenList");var ei=function(t,e,r){return function(n){var o=it(n),i=arguments.length,a=i>1?arguments[1]:void 0,u=void 0!==a,s=u?ar(a,i>2?arguments[2]:void 0):void 0,c=new t,f=0;return Ao(o,function(t){var n=u?s(t,f++):t;r?e(c,kt(n)[0],n[1]):e(c,n)}),c}};Ce({target:"Map",stat:!0,forced:!0},{from:ei(Do.Map,Do.set,!0)});var ri=function(t,e,r){return function(){for(var n=new t,o=arguments.length,i=0;i<o;i++){var a=arguments[i];r?e(n,kt(a)[0],a[1]):e(n,a)}return n}};Ce({target:"Map",stat:!0,forced:!0},{of:ri(Do.Map,Do.set,!0)});var ni=Do.has,oi=function(t){return ni(t),t},ii=Do.remove;Ce({target:"Map",proto:!0,real:!0,forced:!0},{deleteAll:function(){for(var t,e=oi(this),r=!0,n=0,o=arguments.length;n<o;n++)t=ii(e,arguments[n]),r=r&&t;return!!r}});var ai=Do.get,ui=Do.has,si=Do.set;Ce({target:"Map",proto:!0,real:!0,forced:!0},{emplace:function(t,e){var r,n,o=oi(this);return ui(o,t)?(r=ai(o,t),"update"in e&&(r=e.update(r,t,o),si(o,t,r)),r):(n=e.insert(t,o),si(o,t,n),n)}});var ci=function(t,e,r){for(var n,o,i=r?t:t.iterator,a=t.next;!(n=f(a,i)).done;)if(void 0!==(o=e(n.value)))return o},fi=Do.Map,li=Do.proto,hi=b(li.forEach),pi=b(li.entries),vi=pi(new fi).next,di=function(t,e,r){return r?ci({iterator:pi(t),next:vi},function(t){return e(t[1],t[0])}):hi(t,e)};Ce({target:"Map",proto:!0,real:!0,forced:!0},{every:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0);return!1!==di(e,function(t,n){if(!r(t,n,e))return!1},!0)}});var gi=Do.Map,yi=Do.set;Ce({target:"Map",proto:!0,real:!0,forced:!0},{filter:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=new gi;return di(e,function(t,o){r(t,o,e)&&yi(n,o,t)}),n}}),Ce({target:"Map",proto:!0,real:!0,forced:!0},{find:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=di(e,function(t,n){if(r(t,n,e))return{value:t}},!0);return n&&n.value}}),Ce({target:"Map",proto:!0,real:!0,forced:!0},{findKey:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=di(e,function(t,n){if(r(t,n,e))return{key:n}},!0);return n&&n.key}}),Ce({target:"Map",proto:!0,real:!0,forced:!0},{includes:function(t){return!0===di(oi(this),function(e){if((r=e)===(n=t)||r!=r&&n!=n)return!0;var r,n},!0)}});var mi=Do.Map;Ce({target:"Map",stat:!0,forced:!0},{keyBy:function(t,e){var r=new(T(this)?this:mi);J(e);var n=J(r.set);return Ao(t,function(t){f(n,r,e(t),t)}),r}}),Ce({target:"Map",proto:!0,real:!0,forced:!0},{keyOf:function(t){var e=di(oi(this),function(e,r){if(e===t)return{key:r}},!0);return e&&e.key}});var bi=Do.Map,wi=Do.set;Ce({target:"Map",proto:!0,real:!0,forced:!0},{mapKeys:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=new bi;return di(e,function(t,o){wi(n,r(t,o,e),t)}),n}});var Si=Do.Map,Ei=Do.set;Ce({target:"Map",proto:!0,real:!0,forced:!0},{mapValues:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=new Si;return di(e,function(t,o){Ei(n,o,r(t,o,e))}),n}});var Oi=Do.set;Ce({target:"Map",proto:!0,real:!0,arity:1,forced:!0},{merge:function(t){for(var e=oi(this),r=arguments.length,n=0;n<r;)Ao(arguments[n++],function(t,r){Oi(e,t,r)},{AS_ENTRIES:!0});return e}});var xi=TypeError;Ce({target:"Map",proto:!0,real:!0,forced:!0},{reduce:function(t){var e=oi(this),r=arguments.length<2,n=r?void 0:arguments[1];if(J(t),di(e,function(o,i){r?(r=!1,n=o):n=t(n,o,i,e)}),r)throw new xi("Reduce of empty map with no initial value");return n}}),Ce({target:"Map",proto:!0,real:!0,forced:!0},{some:function(t){var e=oi(this),r=ar(t,arguments.length>1?arguments[1]:void 0);return!0===di(e,function(t,n){if(r(t,n,e))return!0},!0)}});var Ri=TypeError,Pi=Do.get,Ai=Do.has,ji=Do.set;Ce({target:"Map",proto:!0,real:!0,forced:!0},{update:function(t,e){var r=oi(this),n=arguments.length;J(e);var o=Ai(r,t);if(!o&&n<3)throw new Ri("Updating absent value");var i=o?Pi(r,t):J(n>2?arguments[2]:void 0)(t,r);return ji(r,t,e(i,t,r)),r}});var ki=TypeError,Ii=function(t,e){var r,n=kt(this),o=J(n.get),i=J(n.has),a=J(n.set),u=arguments.length>2?arguments[2]:void 0;if(!T(e)&&!T(u))throw new ki("At least one callback required");return f(i,n,t)?(r=f(o,n,t),T(e)&&(r=e(r),f(a,n,t,r))):T(u)&&(r=u(),f(a,n,t,r)),r};Ce({target:"Map",proto:!0,real:!0,forced:!0},{upsert:Ii}),Ce({target:"Map",proto:!0,real:!0,name:"upsert",forced:!0},{updateOrInsert:Ii});var Ti=b(1..valueOf),Mi="\t\n\v\f\r                　\u2028\u2029\ufeff",Li=b("".replace),Ui=RegExp("^["+Mi+"]+"),Ni=RegExp("(^|[^"+Mi+"])["+Mi+"]+$"),Ci=function(t){return function(e){var r=Wr(j(e));return 1&t&&(r=Li(r,Ui,"")),2&t&&(r=Li(r,Ni,"$1")),r}},_i={start:Ci(1),end:Ci(2),trim:Ci(3)},Fi=Oe.f,Bi=Rt.f,Di=Ct.f,zi=_i.trim,Wi="Number",qi=i[Wi],Hi=qi.prototype,$i=i.TypeError,Ki=b("".slice),Gi=b("".charCodeAt),Vi=Ue(Wi,!qi(" 0o1")||!qi("0b1")||qi("+0x1")),Yi=function(t){var e,r=arguments.length<1?0:qi(function(t){var e=mt(t,"number");return"bigint"==typeof e?e:function(t){var e,r,n,o,i,a,u,s,c=mt(t,"number");if(G(c))throw new $i("Cannot convert a Symbol value to a number");if("string"==typeof c&&c.length>2)if(c=zi(c),43===(e=Gi(c,0))||45===e){if(88===(r=Gi(c,2))||120===r)return NaN}else if(48===e){switch(Gi(c,1)){case 66:case 98:n=2,o=49;break;case 79:case 111:n=8,o=55;break;default:return+c}for(a=(i=Ki(c,2)).length,u=0;u<a;u++)if((s=Gi(i,u))<48||s>o)return NaN;return parseInt(i,n)}return+c}(e)}(t));return U(Hi,e=this)&&a(function(){Ti(e)})?Io(Object(r),this,Yi):r};Yi.prototype=Hi,Vi&&(Hi.constructor=Yi),Ce({global:!0,constructor:!0,wrap:!0,forced:Vi},{Number:Yi}),Vi&&function(t,e){for(var r,n=u?Fi(e):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(","),o=0;n.length>o;o++)ut(e,r=n[o])&&!ut(t,r)&&Di(t,r,Bi(e,r))}(Yn[Wi],qi),Ce({target:"Number",stat:!0,nonConfigurable:!0,nonWritable:!0},{EPSILON:Math.pow(2,-52)});var Xi=i.isFinite;Ce({target:"Number",stat:!0},{isFinite:Number.isFinite||function(t){return"number"==typeof t&&Xi(t)}});var Ji=Math.floor,Qi=Number.isInteger||function(t){return!M(t)&&isFinite(t)&&Ji(t)===t};Ce({target:"Number",stat:!0},{isInteger:Qi}),Ce({target:"Number",stat:!0},{isNaN:function(t){return t!=t}});var Zi=Math.abs;Ce({target:"Number",stat:!0},{isSafeInteger:function(t){return Qi(t)&&Zi(t)<=9007199254740991}}),Ce({target:"Number",stat:!0,nonConfigurable:!0,nonWritable:!0},{MAX_SAFE_INTEGER:9007199254740991}),Ce({target:"Number",stat:!0,nonConfigurable:!0,nonWritable:!0},{MIN_SAFE_INTEGER:-9007199254740991});var ta=_i.trim,ea=b("".charAt),ra=i.parseFloat,na=i.Symbol,oa=na&&na.iterator,ia=1/ra(Mi+"-0")!=-Infinity||oa&&!a(function(){ra(Object(oa))})?function(t){var e=ta(Wr(t)),r=ra(e);return 0===r&&"-"===ea(e,0)?-0:r}:ra;Ce({target:"Number",stat:!0,forced:Number.parseFloat!==ia},{parseFloat:ia});var aa=_i.trim,ua=i.parseInt,sa=i.Symbol,ca=sa&&sa.iterator,fa=/^[+-]?0x/i,la=b(fa.exec),ha=8!==ua(Mi+"08")||22!==ua(Mi+"0x16")||ca&&!a(function(){ua(Object(ca))})?function(t,e){var r=aa(Wr(t));return ua(r,e>>>0||(la(fa,r)?16:10))}:ua;Ce({target:"Number",stat:!0,forced:Number.parseInt!==ha},{parseInt:ha});var pa=b(v.f),va=b([].push),da=u&&a(function(){var t=Object.create(null);return t[2]=2,!pa(t,2)}),ga=function(t){return function(e){for(var r,n=k(e),o=_e(n),i=da&&null===Qr(n),a=o.length,s=0,c=[];a>s;)r=o[s++],u&&!(i?r in n:pa(n,r))||va(c,t?[r,n[r]]:n[r]);return c}},ya={entries:ga(!0),values:ga(!1)},ma=ya.entries;Ce({target:"Object",stat:!0},{entries:function(t){return ma(t)}}),Ce({target:"Object",stat:!0,sham:!u},{getOwnPropertyDescriptors:function(t){for(var e,r,n=k(t),o=Rt.f,i=Pe(n),a={},u=0;i.length>u;)void 0!==(r=o(n,e=i[u++]))&&Cn(a,e,r);return a}});var ba=a(function(){_e(1)});Ce({target:"Object",stat:!0,forced:ba},{keys:function(t){return _e(it(t))}});var wa=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e};Ce({target:"Object",stat:!0},{is:wa});var Sa=ya.values;Ce({target:"Object",stat:!0},{values:function(t){return Sa(t)}}),Ce({target:"Object",stat:!0},{hasOwn:ut});var Ea=Function.prototype,Oa=Ea.apply,xa=Ea.call,Ra="object"==typeof Reflect&&Reflect.apply||(s?xa.bind(Oa):function(){return xa.apply(Oa,arguments)}),Pa=!a(function(){Reflect.apply(function(){})});Ce({target:"Reflect",stat:!0,forced:Pa},{apply:function(t,e,r){return Ra(J(t),e,kt(r))}});var Aa=Function,ja=b([].concat),ka=b([].join),Ia={},Ta=s?Aa.bind:function(t){var e=J(this),r=e.prototype,n=vo(arguments,1),o=function(){var r=ja(n,vo(arguments));return this instanceof o?function(t,e,r){if(!ut(Ia,e)){for(var n=[],o=0;o<e;o++)n[o]="a["+o+"]";Ia[e]=Aa("C,a","return new C("+ka(n,",")+")")}return Ia[e](t,r)}(e,r.length,r):e.apply(t,r)};return M(r)&&(o.prototype=r),o},Ma=TypeError,La=function(t){if(Sr(t))return t;throw new Ma(Y(t)+" is not a constructor")},Ua=L("Reflect","construct"),Na=Object.prototype,Ca=[].push,_a=a(function(){function t(){}return!(Ua(function(){},[],t)instanceof t)}),Fa=!a(function(){Ua(function(){})}),Ba=_a||Fa;Ce({target:"Reflect",stat:!0,forced:Ba,sham:Ba},{construct:function(t,e){La(t),kt(e);var r=arguments.length<3?t:La(arguments[2]);if(Fa&&!_a)return Ua(t,e,r);if(t===r){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var n=[null];return Ra(Ca,n,e),new(Ra(Ta,t,n))}var o=r.prototype,i=Ve(M(o)?o:Na),a=Ra(t,i,e);return M(a)?a:i}});var Da=a(function(){Reflect.defineProperty(Ct.f({},1,{value:1}),1,{value:2})});Ce({target:"Reflect",stat:!0,forced:Da,sham:!u},{defineProperty:function(t,e,r){kt(t);var n=bt(e);kt(r);try{return Ct.f(t,n,r),!0}catch(t){return!1}}});var za=Rt.f;Ce({target:"Reflect",stat:!0},{deleteProperty:function(t,e){var r=za(kt(t),e);return!(r&&!r.configurable)&&delete t[e]}});var Wa=function(t){return void 0!==t&&(ut(t,"value")||ut(t,"writable"))};Ce({target:"Reflect",stat:!0},{get:function t(e,r){var n,o,i=arguments.length<3?e:arguments[2];return kt(e)===i?e[r]:(n=Rt.f(e,r))?Wa(n)?n.value:void 0===n.get?void 0:f(n.get,i):M(o=Qr(e))?t(o,r,i):void 0}}),Ce({target:"Reflect",stat:!0,sham:!u},{getOwnPropertyDescriptor:function(t,e){return Rt.f(kt(t),e)}}),Ce({target:"Reflect",stat:!0,sham:!Vr},{getPrototypeOf:function(t){return Qr(kt(t))}}),Ce({target:"Reflect",stat:!0},{has:function(t,e){return e in t}}),Ce({target:"Reflect",stat:!0},{isExtensible:function(t){return kt(t),So(t)}}),Ce({target:"Reflect",stat:!0},{ownKeys:Pe}),Ce({target:"Reflect",stat:!0,sham:!Eo},{preventExtensions:function(t){kt(t);try{var e=L("Object","preventExtensions");return e&&e(t),!0}catch(t){return!1}}});var qa=a(function(){var t=function(){},e=Ct.f(new t,"a",{configurable:!0});return!1!==Reflect.set(t.prototype,"a",1,e)});Ce({target:"Reflect",stat:!0,forced:qa},{set:function t(e,r,n){var o,i,a,u=arguments.length<4?e:arguments[3],s=Rt.f(kt(e),r);if(!s){if(M(i=Qr(e)))return t(i,r,n,u);s=d(0)}if(Wa(s)){if(!1===s.writable||!M(u))return!1;if(o=Rt.f(u,r)){if(o.get||o.set||!1===o.writable)return!1;o.value=n,Ct.f(u,r,o)}else Ct.f(u,r,d(0,n))}else{if(void 0===(a=s.set))return!1;f(a,u,n)}return!0}}),dn&&Ce({target:"Reflect",stat:!0},{setPrototypeOf:function(t,e){kt(t),vn(e);try{return dn(t,e),!0}catch(t){return!1}}}),Ce({global:!0},{Reflect:{}}),an(i.Reflect,"Reflect",!0);var Ha=Oo.getWeakData,$a=ne.set,Ka=ne.getterFor,Ga=Ar.find,Va=Ar.findIndex,Ya=b([].splice),Xa=0,Ja=function(t){return t.frozen||(t.frozen=new Qa)},Qa=function(){this.entries=[]},Za=function(t,e){return Ga(t.entries,function(t){return t[0]===e})};Qa.prototype={get:function(t){var e=Za(this,t);if(e)return e[1]},has:function(t){return!!Za(this,t)},set:function(t,e){var r=Za(this,t);r?r[1]=e:this.entries.push([t,e])},delete:function(t){var e=Va(this.entries,function(e){return e[0]===t});return~e&&Ya(this.entries,e,1),!!~e}};var tu,eu={getConstructor:function(t,e,r,n){var o=t(function(t,o){ko(t,i),$a(t,{type:e,id:Xa++,frozen:null}),P(o)||Ao(o,t[n],{that:t,AS_ENTRIES:r})}),i=o.prototype,a=Ka(e),u=function(t,e,r){var n=a(t),o=Ha(kt(e),!0);return!0===o?Ja(n).set(e,r):o[n.id]=r,t};return Mo(i,{delete:function(t){var e=a(this);if(!M(t))return!1;var r=Ha(t);return!0===r?Ja(e).delete(t):r&&ut(r,e.id)&&delete r[e.id]},has:function(t){var e=a(this);if(!M(t))return!1;var r=Ha(t);return!0===r?Ja(e).has(t):r&&ut(r,e.id)}}),Mo(i,r?{get:function(t){var e=a(this);if(M(t)){var r=Ha(t);if(!0===r)return Ja(e).get(t);if(r)return r[e.id]}},set:function(t,e){return u(this,t,e)}}:{add:function(t){return u(this,t,!0)}}),o}},ru=ne.enforce,nu=Object,ou=Array.isArray,iu=nu.isExtensible,au=nu.isFrozen,uu=nu.isSealed,su=nu.freeze,cu=nu.seal,fu=!i.ActiveXObject&&"ActiveXObject"in i,lu=function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},hu=To("WeakMap",lu,eu),pu=hu.prototype,vu=b(pu.set);if(Vt)if(fu){tu=eu.getConstructor(lu,"WeakMap",!0),Oo.enable();var du=b(pu.delete),gu=b(pu.has),yu=b(pu.get);Mo(pu,{delete:function(t){if(M(t)&&!iu(t)){var e=ru(this);return e.frozen||(e.frozen=new tu),du(this,t)||e.frozen.delete(t)}return du(this,t)},has:function(t){if(M(t)&&!iu(t)){var e=ru(this);return e.frozen||(e.frozen=new tu),gu(this,t)||e.frozen.has(t)}return gu(this,t)},get:function(t){if(M(t)&&!iu(t)){var e=ru(this);return e.frozen||(e.frozen=new tu),gu(this,t)?yu(this,t):e.frozen.get(t)}return yu(this,t)},set:function(t,e){if(M(t)&&!iu(t)){var r=ru(this);r.frozen||(r.frozen=new tu),gu(this,t)?vu(this,t,e):r.frozen.set(t,e)}else vu(this,t,e);return this}})}else Eo&&a(function(){var t=su([]);return vu(new hu,t,1),!au(t)})&&Mo(pu,{set:function(t,e){var r;return ou(t)&&(au(t)?r=su:uu(t)&&(r=cu)),vu(this,t,e),r&&r(t),this}});var mu=L("Map"),bu=L("WeakMap"),wu=b([].push),Su=nt("metadata"),Eu=Su.store||(Su.store=new bu),Ou=function(t,e,r){var n=Eu.get(t);if(!n){if(!r)return;Eu.set(t,n=new mu)}var o=n.get(e);if(!o){if(!r)return;n.set(e,o=new mu)}return o},xu={store:Eu,getMap:Ou,has:function(t,e,r){var n=Ou(e,r,!1);return void 0!==n&&n.has(t)},get:function(t,e,r){var n=Ou(e,r,!1);return void 0===n?void 0:n.get(t)},set:function(t,e,r,n){Ou(r,n,!0).set(t,e)},keys:function(t,e){var r=Ou(t,e,!1),n=[];return r&&r.forEach(function(t,e){wu(n,e)}),n},toKey:function(t){return void 0===t||"symbol"==typeof t?t:String(t)}},Ru=xu.toKey,Pu=xu.set;Ce({target:"Reflect",stat:!0},{defineMetadata:function(t,e,r){var n=arguments.length<4?void 0:Ru(arguments[3]);Pu(t,e,kt(r),n)}});var Au=xu.toKey,ju=xu.getMap,ku=xu.store;Ce({target:"Reflect",stat:!0},{deleteMetadata:function(t,e){var r=arguments.length<3?void 0:Au(arguments[2]),n=ju(kt(e),r,!1);if(void 0===n||!n.delete(t))return!1;if(n.size)return!0;var o=ku.get(e);return o.delete(r),!!o.size||ku.delete(e)}});var Iu=xu.has,Tu=xu.get,Mu=xu.toKey,Lu=function(t,e,r){if(Iu(t,e,r))return Tu(t,e,r);var n=Qr(e);return null!==n?Lu(t,n,r):void 0};Ce({target:"Reflect",stat:!0},{getMetadata:function(t,e){var r=arguments.length<3?void 0:Mu(arguments[2]);return Lu(t,kt(e),r)}});var Uu=Do.Map,Nu=Do.has,Cu=Do.set,_u=b([].push),Fu=b(function(t){var e,r,n,o=it(this),i=de(o),a=[],u=new Uu,s=P(t)?function(t){return t}:J(t);for(e=0;e<i;e++)n=s(r=o[e]),Nu(u,n)||Cu(u,n,r);return di(u,function(t){_u(a,t)}),a}),Bu=b([].concat),Du=xu.keys,zu=xu.toKey,Wu=function(t,e){var r=Du(t,e),n=Qr(t);if(null===n)return r;var o=Wu(n,e);return o.length?r.length?Fu(Bu(r,o)):o:r};Ce({target:"Reflect",stat:!0},{getMetadataKeys:function(t){var e=arguments.length<2?void 0:zu(arguments[1]);return Wu(kt(t),e)}});var qu=xu.get,Hu=xu.toKey;Ce({target:"Reflect",stat:!0},{getOwnMetadata:function(t,e){var r=arguments.length<3?void 0:Hu(arguments[2]);return qu(t,kt(e),r)}});var $u=xu.keys,Ku=xu.toKey;Ce({target:"Reflect",stat:!0},{getOwnMetadataKeys:function(t){var e=arguments.length<2?void 0:Ku(arguments[1]);return $u(kt(t),e)}});var Gu=xu.has,Vu=xu.toKey,Yu=function(t,e,r){if(Gu(t,e,r))return!0;var n=Qr(e);return null!==n&&Yu(t,n,r)};Ce({target:"Reflect",stat:!0},{hasMetadata:function(t,e){var r=arguments.length<3?void 0:Vu(arguments[2]);return Yu(t,kt(e),r)}});var Xu=xu.has,Ju=xu.toKey;Ce({target:"Reflect",stat:!0},{hasOwnMetadata:function(t,e){var r=arguments.length<3?void 0:Ju(arguments[2]);return Xu(t,kt(e),r)}});var Qu=xu.toKey,Zu=xu.set;Ce({target:"Reflect",stat:!0},{metadata:function(t,e){return function(r,n){Zu(t,e,kt(r),Qu(n))}}});var ts=dt("match"),es=function(t){var e;return M(t)&&(void 0!==(e=t[ts])?!!e:"RegExp"===E(t))},rs=function(){var t=kt(this),e="";return t.hasIndices&&(e+="d"),t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.unicodeSets&&(e+="v"),t.sticky&&(e+="y"),e},ns=RegExp.prototype,os=function(t){var e=t.flags;return void 0!==e||"flags"in ns||ut(t,"flags")||!U(ns,t)?e:f(rs,t)},is=i.RegExp,as=a(function(){var t=is("a","y");return t.lastIndex=2,null!==t.exec("abcd")}),us=as||a(function(){return!is("a","y").sticky}),ss=as||a(function(){var t=is("^r","gy");return t.lastIndex=2,null!==t.exec("str")}),cs={BROKEN_CARET:ss,MISSED_STICKY:us,UNSUPPORTED_Y:as},fs=Ct.f,ls=function(t,e,r){r in t||fs(t,r,{configurable:!0,get:function(){return e[r]},set:function(t){e[r]=t}})},hs=i.RegExp,ps=a(function(){var t=hs(".","s");return!(t.dotAll&&t.test("\n")&&"s"===t.flags)}),vs=i.RegExp,ds=a(function(){var t=vs("(?<a>b)","g");return"b"!==t.exec("b").groups.a||"bc"!=="b".replace(t,"$<a>c")}),gs=Oe.f,ys=ne.enforce,ms=dt("match"),bs=i.RegExp,ws=bs.prototype,Ss=i.SyntaxError,Es=b(ws.exec),Os=b("".charAt),xs=b("".replace),Rs=b("".indexOf),Ps=b("".slice),As=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,js=/a/g,ks=/a/g,Is=new bs(js)!==js,Ts=cs.MISSED_STICKY,Ms=cs.UNSUPPORTED_Y,Ls=u&&(!Is||Ts||ps||ds||a(function(){return ks[ms]=!1,bs(js)!==js||bs(ks)===ks||"/a/i"!==String(bs(js,"i"))}));if(Ue("RegExp",Ls)){for(var Us=function(t,e){var r,n,o,i,a,u,s=U(ws,this),c=es(t),f=void 0===e,l=[],h=t;if(!s&&c&&f&&t.constructor===Us)return t;if((c||U(ws,t))&&(t=t.source,f&&(e=os(h))),t=void 0===t?"":Wr(t),e=void 0===e?"":Wr(e),h=t,ps&&"dotAll"in js&&(n=!!e&&Rs(e,"s")>-1)&&(e=xs(e,/s/g,"")),r=e,Ts&&"sticky"in js&&(o=!!e&&Rs(e,"y")>-1)&&Ms&&(e=xs(e,/y/g,"")),ds&&(i=function(t){for(var e,r=t.length,n=0,o="",i=[],a=Ve(null),u=!1,s=!1,c=0,f="";n<=r;n++){if("\\"===(e=Os(t,n)))e+=Os(t,++n);else if("]"===e)u=!1;else if(!u)switch(!0){case"["===e:u=!0;break;case"("===e:if(o+=e,"?:"===Ps(t,n+1,n+3))continue;Es(As,Ps(t,n+1))&&(n+=2,s=!0),c++;continue;case">"===e&&s:if(""===f||ut(a,f))throw new Ss("Invalid capture group name");a[f]=!0,i[i.length]=[f,c],s=!1,f="";continue}s?f+=e:o+=e}return[o,i]}(t),t=i[0],l=i[1]),a=Io(bs(t,e),s?this:ws,Us),(n||o||l.length)&&(u=ys(a),n&&(u.dotAll=!0,u.raw=Us(function(t){for(var e,r=t.length,n=0,o="",i=!1;n<=r;n++)"\\"!==(e=Os(t,n))?i||"."!==e?("["===e?i=!0:"]"===e&&(i=!1),o+=e):o+="[\\s\\S]":o+=e+Os(t,++n);return o}(t),r)),o&&(u.sticky=!0),l.length&&(u.groups=l)),t!==h)try{_t(a,"source",""===h?"(?:)":h)}catch(t){}return a},Ns=gs(bs),Cs=0;Ns.length>Cs;)ls(Us,bs,Ns[Cs++]);ws.constructor=Us,Us.prototype=ws,ie(i,"RegExp",Us,{constructor:!0})}Uo("RegExp");var _s=zt.PROPER,Fs="toString",Bs=RegExp.prototype,Ds=Bs[Fs];(a(function(){return"/a/b"!==Ds.call({source:"a",flags:"b"})})||_s&&Ds.name!==Fs)&&ie(Bs,Fs,function(){var t=kt(this);return"/"+Wr(t.source)+"/"+Wr(os(t))},{unsafe:!0});var zs=ne.get,Ws=RegExp.prototype,qs=TypeError;u&&ps&&so(Ws,"dotAll",{configurable:!0,get:function(){if(this!==Ws){if("RegExp"===E(this))return!!zs(this).dotAll;throw new qs("Incompatible receiver, RegExp required")}}});var Hs=ne.get,$s=nt("native-string-replace",String.prototype.replace),Ks=RegExp.prototype.exec,Gs=Ks,Vs=b("".charAt),Ys=b("".indexOf),Xs=b("".replace),Js=b("".slice),Qs=function(){var t=/a/,e=/b*/g;return f(Ks,t,"a"),f(Ks,e,"a"),0!==t.lastIndex||0!==e.lastIndex}(),Zs=cs.BROKEN_CARET,tc=void 0!==/()??/.exec("")[1];(Qs||tc||Zs||ps||ds)&&(Gs=function(t){var e,r,n,o,i,a,u,s=this,c=Hs(s),l=Wr(t),h=c.raw;if(h)return h.lastIndex=s.lastIndex,e=f(Gs,h,l),s.lastIndex=h.lastIndex,e;var p=c.groups,v=Zs&&s.sticky,d=f(rs,s),g=s.source,y=0,m=l;if(v&&(d=Xs(d,"y",""),-1===Ys(d,"g")&&(d+="g"),m=Js(l,s.lastIndex),s.lastIndex>0&&(!s.multiline||s.multiline&&"\n"!==Vs(l,s.lastIndex-1))&&(g="(?: "+g+")",m=" "+m,y++),r=new RegExp("^(?:"+g+")",d)),tc&&(r=new RegExp("^"+g+"$(?!\\s)",d)),Qs&&(n=s.lastIndex),o=f(Ks,v?r:s,m),v?o?(o.input=Js(o.input,y),o[0]=Js(o[0],y),o.index=s.lastIndex,s.lastIndex+=o[0].length):s.lastIndex=0:Qs&&o&&(s.lastIndex=s.global?o.index+o[0].length:n),tc&&o&&o.length>1&&f($s,o[0],r,function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(o[i]=void 0)}),o&&p)for(o.groups=a=Ve(null),i=0;i<p.length;i++)a[(u=p[i])[0]]=o[u[1]];return o});var ec=Gs;Ce({target:"RegExp",proto:!0,forced:/./.exec!==ec},{exec:ec});var rc=i.RegExp,nc=rc.prototype;u&&a(function(){var t=!0;try{rc(".","d")}catch(e){t=!1}var e={},r="",n=t?"dgimsy":"gimsy",o=function(t,n){Object.defineProperty(e,t,{get:function(){return r+=n,!0}})},i={dotAll:"s",global:"g",ignoreCase:"i",multiline:"m",sticky:"y"};for(var a in t&&(i.hasIndices="d"),i)o(a,i[a]);return Object.getOwnPropertyDescriptor(nc,"flags").get.call(e)!==n||r!==n})&&so(nc,"flags",{configurable:!0,get:rs});var oc=ne.get,ic=RegExp.prototype,ac=TypeError;u&&cs.MISSED_STICKY&&so(ic,"sticky",{configurable:!0,get:function(){if(this!==ic){if("RegExp"===E(this))return!!oc(this).sticky;throw new ac("Incompatible receiver, RegExp required")}}});var uc,sc,cc=(uc=!1,(sc=/[ac]/).exec=function(){return uc=!0,/./.exec.apply(this,arguments)},!0===sc.test("abc")&&uc),fc=/./.test;Ce({target:"RegExp",proto:!0,forced:!cc},{test:function(t){var e=kt(this),r=Wr(t),n=e.exec;if(!T(n))return f(fc,e,r);var o=f(n,e,r);return null!==o&&(kt(o),!0)}});var lc=dt("species"),hc=RegExp.prototype,pc=function(t,e,r,n){var o=dt(t),i=!a(function(){var e={};return e[o]=function(){return 7},7!==""[t](e)}),u=i&&!a(function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[lc]=function(){return r},r.flags="",r[o]=/./[o]),r.exec=function(){return e=!0,null},r[o](""),!e});if(!i||!u||r){var s=/./[o],c=e(o,""[t],function(t,e,r,n,o){var a=e.exec;return a===ec||a===hc.exec?i&&!o?{done:!0,value:f(s,e,r,n)}:{done:!0,value:f(t,r,e,n)}:{done:!1}});ie(String.prototype,t,c[0]),ie(hc,o,c[1])}n&&_t(hc[o],"sham",!0)},vc=Gr.charAt,dc=function(t,e,r){return e+(r?vc(t,e).length:1)},gc=TypeError,yc=function(t,e){var r=t.exec;if(T(r)){var n=f(r,t,e);return null!==n&&kt(n),n}if("RegExp"===E(t))return f(ec,t,e);throw new gc("RegExp#exec called on incompatible receiver")};pc("match",function(t,e,r){return[function(e){var r=j(this),n=P(e)?void 0:Q(e,t);return n?f(n,e,r):new RegExp(e)[t](Wr(r))},function(t){var n=kt(this),o=Wr(t),i=r(e,n,o);if(i.done)return i.value;if(!n.global)return yc(n,o);var a=n.unicode;n.lastIndex=0;for(var u,s=[],c=0;null!==(u=yc(n,o));){var f=Wr(u[0]);s[c]=f,""===f&&(n.lastIndex=dc(o,ve(n.lastIndex),a)),c++}return 0===c?null:s}]});var mc=Math.floor,bc=b("".charAt),wc=b("".replace),Sc=b("".slice),Ec=/\$([$&'`]|\d{1,2}|<[^>]*>)/g,Oc=/\$([$&'`]|\d{1,2})/g,xc=function(t,e,r,n,o,i){var a=r+t.length,u=n.length,s=Oc;return void 0!==o&&(o=it(o),s=Ec),wc(i,s,function(i,s){var c;switch(bc(s,0)){case"$":return"$";case"&":return t;case"`":return Sc(e,0,r);case"'":return Sc(e,a);case"<":c=o[Sc(s,1,-1)];break;default:var f=+s;if(0===f)return i;if(f>u){var l=mc(f/10);return 0===l?i:l<=u?void 0===n[l-1]?bc(s,1):n[l-1]+bc(s,1):i}c=n[f-1]}return void 0===c?"":c})},Rc=dt("replace"),Pc=Math.max,Ac=Math.min,jc=b([].concat),kc=b([].push),Ic=b("".indexOf),Tc=b("".slice),Mc="$0"==="a".replace(/./,"$0"),Lc=!!/./[Rc]&&""===/./[Rc]("a","$0"),Uc=!a(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")});pc("replace",function(t,e,r){var n=Lc?"$":"$0";return[function(t,r){var n=j(this),o=P(t)?void 0:Q(t,Rc);return o?f(o,t,n,r):f(e,Wr(n),t,r)},function(t,o){var i=kt(this),a=Wr(t);if("string"==typeof o&&-1===Ic(o,n)&&-1===Ic(o,"$<")){var u=r(e,i,a,o);if(u.done)return u.value}var s=T(o);s||(o=Wr(o));var c,f=i.global;f&&(c=i.unicode,i.lastIndex=0);for(var l,h=[];null!==(l=yc(i,a))&&(kc(h,l),f);)""===Wr(l[0])&&(i.lastIndex=dc(a,ve(i.lastIndex),c));for(var p,v="",d=0,g=0;g<h.length;g++){for(var y,m=Wr((l=h[g])[0]),b=Pc(Ac(ce(l.index),a.length),0),w=[],S=1;S<l.length;S++)kc(w,void 0===(p=l[S])?p:String(p));var E=l.groups;if(s){var O=jc([m],w,b,a);void 0!==E&&kc(O,E),y=Wr(Ra(o,void 0,O))}else y=xc(m,a,b,w,E,o);b>=d&&(v+=Tc(a,d,b)+y,d=b+m.length)}return v+Tc(a,d)}]},!Uc||!Mc||Lc),pc("search",function(t,e,r){return[function(e){var r=j(this),n=P(e)?void 0:Q(e,t);return n?f(n,e,r):new RegExp(e)[t](Wr(r))},function(t){var n=kt(this),o=Wr(t),i=r(e,n,o);if(i.done)return i.value;var a=n.lastIndex;wa(a,0)||(n.lastIndex=0);var u=yc(n,o);return wa(n.lastIndex,a)||(n.lastIndex=a),null===u?-1:u.index}]});var Nc=dt("species"),Cc=function(t,e){var r,n=kt(t).constructor;return void 0===n||P(r=kt(n)[Nc])?e:La(r)},_c=cs.UNSUPPORTED_Y,Fc=Math.min,Bc=b([].push),Dc=b("".slice),zc=!a(function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]}),Wc="c"==="abbc".split(/(b)*/)[1]||4!=="test".split(/(?:)/,-1).length||2!=="ab".split(/(?:ab)*/).length||4!==".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length;pc("split",function(t,e,r){var n="0".split(void 0,0).length?function(t,r){return void 0===t&&0===r?[]:f(e,this,t,r)}:e;return[function(e,r){var o=j(this),i=P(e)?void 0:Q(e,t);return i?f(i,e,o,r):f(n,Wr(o),e,r)},function(t,o){var i=kt(this),a=Wr(t);if(!Wc){var u=r(n,i,a,o,n!==e);if(u.done)return u.value}var s=Cc(i,RegExp),c=i.unicode,f=new s(_c?"^(?:"+i.source+")":i,(i.ignoreCase?"i":"")+(i.multiline?"m":"")+(i.unicode?"u":"")+(_c?"g":"y")),l=void 0===o?4294967295:o>>>0;if(0===l)return[];if(0===a.length)return null===yc(f,a)?[a]:[];for(var h=0,p=0,v=[];p<a.length;){f.lastIndex=_c?0:p;var d,g=yc(f,_c?Dc(a,p):a);if(null===g||(d=Fc(ve(f.lastIndex+(_c?p:0)),a.length))===h)p=dc(a,p,c);else{if(Bc(v,Dc(a,h,p)),v.length===l)return v;for(var y=1;y<=g.length-1;y++)if(Bc(v,g[y]),v.length===l)return v;p=h=d}}return Bc(v,Dc(a,h)),v}]},Wc||!zc,_c);var qc=TypeError,Hc=RangeError,$c=function(t){var e=Wr(j(this)),r="",n=ce(t);if(n<0||Infinity===n)throw new Hc("Wrong number of repetitions");for(;n>0;(n>>>=1)&&(e+=e))1&n&&(r+=e);return r},Kc=b($c),Gc=b("".slice),Vc=Math.ceil,Yc=function(t){return function(e,r,n){var o,i,a=Wr(j(e)),u=ve(r),s=a.length,c=void 0===n?" ":Wr(n);return u<=s||""===c?a:((i=Kc(c,Vc((o=u-s)/c.length))).length>o&&(i=Gc(i,0,o)),t?a+i:i+a)}},Xc={start:Yc(!1),end:Yc(!0)},Jc=Xc.start,Qc=Array,Zc=RegExp.escape,tf=b("".charAt),ef=b("".charCodeAt),rf=b(1.1.toString),nf=b([].join),of=/^[0-9a-z]/i,af=/^[$()*+./?[\\\]^{|}]/,uf=RegExp("^[!\"#%&',\\-:;<=>@`~"+Mi+"]"),sf=b(of.exec),cf={"\t":"t","\n":"n","\v":"v","\f":"f","\r":"r"},ff=function(t){var e=rf(ef(t,0),16);return e.length<3?"\\x"+Jc(e,2,"0"):"\\u"+Jc(e,4,"0")},lf=!Zc||"\\x61b"!==Zc("ab");Ce({target:"RegExp",stat:!0,forced:lf},{escape:function(t){!function(t){if("string"==typeof t)return t;throw new qc("Argument is not a string")}(t);for(var e=t.length,r=Qc(e),n=0;n<e;n++){var o=tf(t,n);if(0===n&&sf(of,o))r[n]=ff(o);else if(ut(cf,o))r[n]="\\"+cf[o];else if(sf(af,o))r[n]="\\"+o;else if(sf(uf,o))r[n]=ff(o);else{var i=ef(o,0);55296!=(63488&i)?r[n]=o:i>=56320||n+1>=e||56320!=(64512&ef(t,n+1))?r[n]=ff(o):(r[n]=o,r[++n]=tf(t,n))}}return nf(r,"")}}),To("Set",function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},Fo);var hf=Set.prototype,pf={Set:Set,add:b(hf.add),has:b(hf.has),remove:b(hf.delete),proto:hf},vf=pf.has,df=function(t){return vf(t),t},gf=pf.Set,yf=pf.proto,mf=b(yf.forEach),bf=b(yf.keys),wf=bf(new gf).next,Sf=function(t,e,r){return r?ci({iterator:bf(t),next:wf},e):mf(t,e)},Ef=pf.Set,Of=pf.add,xf=function(t){var e=new Ef;return Sf(t,function(t){Of(e,t)}),e},Rf=ln(pf.proto,"size","get")||function(t){return t.size},Pf="Invalid size",Af=RangeError,jf=TypeError,kf=Math.max,If=function(t,e){this.set=t,this.size=kf(e,0),this.has=J(t.has),this.keys=J(t.keys)};If.prototype={getIterator:function(){return{iterator:t=kt(f(this.keys,this.set)),next:t.next,done:!1};var t},includes:function(t){return f(this.has,this.set,t)}};var Tf=function(t){kt(t);var e=+t.size;if(e!=e)throw new jf(Pf);var r=ce(e);if(r<0)throw new Af(Pf);return new If(t,r)},Mf=pf.has,Lf=pf.remove,Uf=function(t){var e=df(this),r=Tf(t),n=xf(e);return Rf(e)<=r.size?Sf(e,function(t){r.includes(t)&&Lf(n,t)}):ci(r.getIterator(),function(t){Mf(e,t)&&Lf(n,t)}),n},Nf=function(t){return{size:t,has:function(){return!1},keys:function(){return{next:function(){return{done:!0}}}}}},Cf=function(t){var e=L("Set");try{(new e)[t](Nf(0));try{return(new e)[t](Nf(-1)),!1}catch(t){return!0}}catch(t){return!1}};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("difference")},{difference:Uf});var _f=pf.Set,Ff=pf.add,Bf=pf.has,Df=function(t){var e=df(this),r=Tf(t),n=new _f;return Rf(e)>r.size?ci(r.getIterator(),function(t){Bf(e,t)&&Ff(n,t)}):Sf(e,function(t){r.includes(t)&&Ff(n,t)}),n},zf=!Cf("intersection")||a(function(){return"3,2"!==String(Array.from(new Set([1,2,3]).intersection(new Set([3,2]))))});Ce({target:"Set",proto:!0,real:!0,forced:zf},{intersection:Df});var Wf=pf.has,qf=function(t){var e=df(this),r=Tf(t);if(Rf(e)<=r.size)return!1!==Sf(e,function(t){if(r.includes(t))return!1},!0);var n=r.getIterator();return!1!==ci(n,function(t){if(Wf(e,t))return Tn(n,"normal",!1)})};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("isDisjointFrom")},{isDisjointFrom:qf});var Hf=function(t){var e=df(this),r=Tf(t);return!(Rf(e)>r.size)&&!1!==Sf(e,function(t){if(!r.includes(t))return!1},!0)};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("isSubsetOf")},{isSubsetOf:Hf});var $f=pf.has,Kf=function(t){var e=df(this),r=Tf(t);if(Rf(e)<r.size)return!1;var n=r.getIterator();return!1!==ci(n,function(t){if(!$f(e,t))return Tn(n,"normal",!1)})};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("isSupersetOf")},{isSupersetOf:Kf});var Gf=pf.add,Vf=pf.has,Yf=pf.remove,Xf=function(t){var e=df(this),r=Tf(t).getIterator(),n=xf(e);return ci(r,function(t){Vf(e,t)?Yf(n,t):Gf(n,t)}),n};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("symmetricDifference")},{symmetricDifference:Xf});var Jf=pf.add,Qf=function(t){var e=df(this),r=Tf(t).getIterator(),n=xf(e);return ci(r,function(t){Jf(n,t)}),n};Ce({target:"Set",proto:!0,real:!0,forced:!Cf("union")},{union:Qf}),Ce({target:"Set",stat:!0,forced:!0},{from:ei(pf.Set,pf.add,!1)}),Ce({target:"Set",stat:!0,forced:!0},{of:ri(pf.Set,pf.add,!1)});var Zf=pf.add;Ce({target:"Set",proto:!0,real:!0,forced:!0},{addAll:function(){for(var t=df(this),e=0,r=arguments.length;e<r;e++)Zf(t,arguments[e]);return t}});var tl=pf.remove;Ce({target:"Set",proto:!0,real:!0,forced:!0},{deleteAll:function(){for(var t,e=df(this),r=!0,n=0,o=arguments.length;n<o;n++)t=tl(e,arguments[n]),r=r&&t;return!!r}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{every:function(t){var e=df(this),r=ar(t,arguments.length>1?arguments[1]:void 0);return!1!==Sf(e,function(t){if(!r(t,t,e))return!1},!0)}});var el=dt("iterator"),rl=Object,nl=L("Set"),ol=function(t){return function(t){return M(t)&&"number"==typeof t.size&&T(t.has)&&T(t.keys)}(t)?t:function(t){if(P(t))return!1;var e=rl(t);return void 0!==e[el]||"@@iterator"in e||ut(un,pr(e))}(t)?new nl(t):t};Ce({target:"Set",proto:!0,real:!0,forced:!0},{difference:function(t){return f(Uf,this,ol(t))}});var il=pf.Set,al=pf.add;Ce({target:"Set",proto:!0,real:!0,forced:!0},{filter:function(t){var e=df(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=new il;return Sf(e,function(t){r(t,t,e)&&al(n,t)}),n}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{find:function(t){var e=df(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=Sf(e,function(t){if(r(t,t,e))return{value:t}},!0);return n&&n.value}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{intersection:function(t){return f(Df,this,ol(t))}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{isDisjointFrom:function(t){return f(qf,this,ol(t))}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{isSubsetOf:function(t){return f(Hf,this,ol(t))}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{isSupersetOf:function(t){return f(Kf,this,ol(t))}});var ul=b([].join),sl=b([].push);Ce({target:"Set",proto:!0,real:!0,forced:!0},{join:function(t){var e=df(this),r=void 0===t?",":Wr(t),n=[];return Sf(e,function(t){sl(n,t)}),ul(n,r)}});var cl=pf.Set,fl=pf.add;Ce({target:"Set",proto:!0,real:!0,forced:!0},{map:function(t){var e=df(this),r=ar(t,arguments.length>1?arguments[1]:void 0),n=new cl;return Sf(e,function(t){fl(n,r(t,t,e))}),n}});var ll=TypeError;Ce({target:"Set",proto:!0,real:!0,forced:!0},{reduce:function(t){var e=df(this),r=arguments.length<2,n=r?void 0:arguments[1];if(J(t),Sf(e,function(o){r?(r=!1,n=o):n=t(n,o,o,e)}),r)throw new ll("Reduce of empty set with no initial value");return n}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{some:function(t){var e=df(this),r=ar(t,arguments.length>1?arguments[1]:void 0);return!0===Sf(e,function(t){if(r(t,t,e))return!0},!0)}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{symmetricDifference:function(t){return f(Xf,this,ol(t))}}),Ce({target:"Set",proto:!0,real:!0,forced:!0},{union:function(t){return f(Qf,this,ol(t))}});var hl=dt("species"),pl=dt("isConcatSpreadable"),vl=W>=51||!a(function(){var t=[];return t[pl]=!1,t.concat()[0]!==t}),dl=function(t){if(!M(t))return!1;var e=t[pl];return void 0!==e?!!e:ur(t)},gl=!(vl&&(W>=51||!a(function(){var t=[];return(t.constructor={})[hl]=function(){return{foo:1}},1!==t.concat(Boolean).foo})));Ce({target:"Array",proto:!0,arity:1,forced:gl},{concat:function(t){var e,r,n,o,i,a=it(this),u=xr(a,0),s=0;for(e=-1,n=arguments.length;e<n;e++)if(dl(i=-1===e?a:arguments[e]))for(o=de(i),Nr(s+o),r=0;r<o;r++,s++)r in i&&Cn(u,s,i[r]);else Nr(s+1),Cn(u,s++,i);return u.length=s,u}});var yl={f:dt},ml=Ct.f,bl=function(t){var e=Yn.Symbol||(Yn.Symbol={});ut(e,t)||ml(e,t,{value:yl.f(t)})},wl=function(){var t=L("Symbol"),e=t&&t.prototype,r=e&&e.valueOf,n=dt("toPrimitive");e&&!e[n]&&ie(e,n,function(t){return f(r,this)},{arity:1})},Sl=Ar.forEach,El=Xt("hidden"),Ol="Symbol",xl="prototype",Rl=ne.set,Pl=ne.getterFor(Ol),Al=Object[xl],jl=i.Symbol,kl=jl&&jl[xl],Il=i.RangeError,Tl=i.TypeError,Ml=i.QObject,Ll=Rt.f,Ul=Ct.f,Nl=mo.f,Cl=v.f,_l=b([].push),Fl=nt("symbols"),Bl=nt("op-symbols"),Dl=nt("wks"),zl=!Ml||!Ml[xl]||!Ml[xl].findChild,Wl=function(t,e,r){var n=Ll(Al,e);n&&delete Al[e],Ul(t,e,r),n&&t!==Al&&Ul(Al,e,n)},ql=u&&a(function(){return 7!==Ve(Ul({},"a",{get:function(){return Ul(this,"a",{value:7}).a}})).a})?Wl:Ul,Hl=function(t,e){var r=Fl[t]=Ve(kl);return Rl(r,{type:Ol,tag:t,description:e}),u||(r.description=e),r},$l=function(t,e,r){t===Al&&$l(Bl,e,r),kt(t);var n=bt(e);return kt(r),ut(Fl,n)?(r.enumerable?(ut(t,El)&&t[El][n]&&(t[El][n]=!1),r=Ve(r,{enumerable:d(0,!1)})):(ut(t,El)||Ul(t,El,d(1,Ve(null))),t[El][n]=!0),ql(t,n,r)):Ul(t,n,r)},Kl=function(t,e){kt(t);var r=k(e),n=_e(r).concat(Xl(r));return Sl(n,function(e){u&&!f(Gl,r,e)||$l(t,e,r[e])}),t},Gl=function(t){var e=bt(t),r=f(Cl,this,e);return!(this===Al&&ut(Fl,e)&&!ut(Bl,e))&&(!(r||!ut(this,e)||!ut(Fl,e)||ut(this,El)&&this[El][e])||r)},Vl=function(t,e){var r=k(t),n=bt(e);if(r!==Al||!ut(Fl,n)||ut(Bl,n)){var o=Ll(r,n);return!o||!ut(Fl,n)||ut(r,El)&&r[El][n]||(o.enumerable=!0),o}},Yl=function(t){var e=Nl(k(t)),r=[];return Sl(e,function(t){ut(Fl,t)||ut(Jt,t)||_l(r,t)}),r},Xl=function(t){var e=t===Al,r=Nl(e?Bl:k(t)),n=[];return Sl(r,function(t){!ut(Fl,t)||e&&!ut(Al,t)||_l(n,Fl[t])}),n};H||(jl=function(){if(U(kl,this))throw new Tl("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?Wr(arguments[0]):void 0,e=lt(t),r=function(t){var n=void 0===this?i:this;n===Al&&f(r,Bl,t),ut(n,El)&&ut(n[El],e)&&(n[El][e]=!1);var o=d(1,t);try{ql(n,e,o)}catch(t){if(!(t instanceof Il))throw t;Wl(n,e,o)}};return u&&zl&&ql(Al,e,{configurable:!0,set:r}),Hl(e,t)},ie(kl=jl[xl],"toString",function(){return Pl(this).tag}),ie(jl,"withoutSetter",function(t){return Hl(lt(t),t)}),v.f=Gl,Ct.f=$l,Be.f=Kl,Rt.f=Vl,Oe.f=mo.f=Yl,xe.f=Xl,yl.f=function(t){return Hl(dt(t),t)},u&&(so(kl,"description",{configurable:!0,get:function(){return Pl(this).description}}),ie(Al,"propertyIsEnumerable",Gl,{unsafe:!0}))),Ce({global:!0,constructor:!0,wrap:!0,forced:!H,sham:!H},{Symbol:jl}),Sl(_e(Dl),function(t){bl(t)}),Ce({target:Ol,stat:!0,forced:!H},{useSetter:function(){zl=!0},useSimple:function(){zl=!1}}),Ce({target:"Object",stat:!0,forced:!H,sham:!u},{create:function(t,e){return void 0===e?Ve(t):Kl(Ve(t),e)},defineProperty:$l,defineProperties:Kl,getOwnPropertyDescriptor:Vl}),Ce({target:"Object",stat:!0,forced:!H},{getOwnPropertyNames:Yl}),wl(),an(jl,Ol),Jt[El]=!0;var Jl=H&&!!Symbol.for&&!!Symbol.keyFor,Ql=nt("string-to-symbol-registry"),Zl=nt("symbol-to-string-registry");Ce({target:"Symbol",stat:!0,forced:!Jl},{for:function(t){var e=Wr(t);if(ut(Ql,e))return Ql[e];var r=L("Symbol")(e);return Ql[e]=r,Zl[r]=e,r}});var th=nt("symbol-to-string-registry");Ce({target:"Symbol",stat:!0,forced:!Jl},{keyFor:function(t){if(!G(t))throw new TypeError(Y(t)+" is not a symbol");if(ut(th,t))return th[t]}});var eh=b([].push),rh=String,nh=L("JSON","stringify"),oh=b(/./.exec),ih=b("".charAt),ah=b("".charCodeAt),uh=b("".replace),sh=b(1..toString),ch=/[\uD800-\uDFFF]/g,fh=/^[\uD800-\uDBFF]$/,lh=/^[\uDC00-\uDFFF]$/,hh=!H||a(function(){var t=L("Symbol")("stringify detection");return"[null]"!==nh([t])||"{}"!==nh({a:t})||"{}"!==nh(Object(t))}),ph=a(function(){return'"\\udf06\\ud834"'!==nh("\udf06\ud834")||'"\\udead"'!==nh("\udead")}),vh=function(t,e){var r=vo(arguments),n=function(t){if(T(t))return t;if(ur(t)){for(var e=t.length,r=[],n=0;n<e;n++){var o=t[n];"string"==typeof o?eh(r,o):"number"!=typeof o&&"Number"!==E(o)&&"String"!==E(o)||eh(r,Wr(o))}var i=r.length,a=!0;return function(t,e){if(a)return a=!1,e;if(ur(this))return e;for(var n=0;n<i;n++)if(r[n]===t)return e}}}(e);if(T(n)||void 0!==t&&!G(t))return r[1]=function(t,e){if(T(n)&&(e=f(n,this,rh(t),e)),!G(e))return e},Ra(nh,null,r)},dh=function(t,e,r){var n=ih(r,e-1),o=ih(r,e+1);return oh(fh,t)&&!oh(lh,o)||oh(lh,t)&&!oh(fh,n)?"\\u"+sh(ah(t,0),16):t};nh&&Ce({target:"JSON",stat:!0,arity:3,forced:hh||ph},{stringify:function(t,e,r){var n=vo(arguments),o=Ra(hh?vh:nh,null,n);return ph&&"string"==typeof o?uh(o,ch,dh):o}});var gh=!H||a(function(){xe.f(1)});Ce({target:"Object",stat:!0,forced:gh},{getOwnPropertySymbols:function(t){var e=xe.f;return e?e(it(t)):[]}}),bl("asyncIterator");var yh=i.Symbol,mh=yh&&yh.prototype;if(u&&T(yh)&&(!("description"in mh)||void 0!==yh().description)){var bh={},wh=function(){var t=arguments.length<1||void 0===arguments[0]?void 0:Wr(arguments[0]),e=U(mh,this)?new yh(t):void 0===t?yh():yh(t);return""===t&&(bh[e]=!0),e};Ae(wh,yh),wh.prototype=mh,mh.constructor=wh;var Sh="Symbol(description detection)"===String(yh("description detection")),Eh=b(mh.valueOf),Oh=b(mh.toString),xh=/^Symbol\((.*)\)[^)]+$/,Rh=b("".replace),Ph=b("".slice);so(mh,"description",{configurable:!0,get:function(){var t=Eh(this);if(ut(bh,t))return"";var e=Oh(t),r=Sh?Ph(e,7,-1):Rh(e,xh,"$1");return""===r?void 0:r}}),Ce({global:!0,constructor:!0,forced:!0},{Symbol:wh})}bl("hasInstance"),bl("isConcatSpreadable"),bl("iterator"),bl("match"),bl("matchAll"),bl("replace"),bl("search"),bl("species"),bl("split"),bl("toPrimitive"),wl(),bl("toStringTag"),an(L("Symbol"),"Symbol"),bl("unscopables"),an(i.JSON,"JSON",!0),an(Math,"Math",!0);var Ah=Ct.f,jh=dt("metadata"),kh=Function.prototype;void 0===kh[jh]&&Ah(kh,jh,{value:null});var Ih=Ct.f,Th=Rt.f,Mh=i.Symbol;if(bl("asyncDispose"),Mh){var Lh=Th(Mh,"asyncDispose");Lh.enumerable&&Lh.configurable&&Lh.writable&&Ih(Mh,"asyncDispose",{value:Lh.value,enumerable:!1,configurable:!1,writable:!1})}var Uh=Ct.f,Nh=Rt.f,Ch=i.Symbol;if(bl("dispose"),Ch){var _h=Nh(Ch,"dispose");_h.enumerable&&_h.configurable&&_h.writable&&Uh(Ch,"dispose",{value:_h.value,enumerable:!1,configurable:!1,writable:!1})}bl("metadata");var Fh=L("Symbol"),Bh=Fh.keyFor,Dh=b(Fh.prototype.valueOf),zh=Fh.isRegisteredSymbol||function(t){try{return void 0!==Bh(Dh(t))}catch(t){return!1}};Ce({target:"Symbol",stat:!0},{isRegisteredSymbol:zh});for(var Wh=L("Symbol"),qh=Wh.isWellKnownSymbol,Hh=L("Object","getOwnPropertyNames"),$h=b(Wh.prototype.valueOf),Kh=nt("wks"),Gh=0,Vh=Hh(Wh),Yh=Vh.length;Gh<Yh;Gh++)try{var Xh=Vh[Gh];G(Wh[Xh])&&dt(Xh)}catch(t){}var Jh=function(t){if(qh&&qh(t))return!0;try{for(var e=$h(t),r=0,n=Hh(Kh),o=n.length;r<o;r++)if(Kh[n[r]]==e)return!0}catch(t){}return!1};Ce({target:"Symbol",stat:!0,forced:!0},{isWellKnownSymbol:Jh}),bl("customMatcher"),bl("observable"),Ce({target:"Symbol",stat:!0,name:"isRegisteredSymbol"},{isRegistered:zh}),Ce({target:"Symbol",stat:!0,name:"isWellKnownSymbol",forced:!0},{isWellKnown:Jh}),bl("matcher"),bl("metadataKey"),bl("patternMatch"),bl("replaceAll"),yl.f("asyncIterator");var Qh=Gr.codeAt;Ce({target:"String",proto:!0},{codePointAt:function(t){return Qh(this,t)}}),Ze("String","codePointAt");var Zh=TypeError,tp=function(t){if(es(t))throw new Zh("The method doesn't accept regular expressions");return t},ep=dt("match"),rp=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[ep]=!1,"/./"[t](e)}catch(t){}}return!1},np=Rt.f,op=or("".slice),ip=Math.min,ap=rp("endsWith"),up=!ap&&!!function(){var t=np(String.prototype,"endsWith");return t&&!t.writable}();Ce({target:"String",proto:!0,forced:!up&&!ap},{endsWith:function(t){var e=Wr(j(this));tp(t);var r=arguments.length>1?arguments[1]:void 0,n=e.length,o=void 0===r?n:ip(ve(r),n),i=Wr(t);return op(e,o-i.length,o)===i}}),Ze("String","endsWith");var sp=RangeError,cp=String.fromCharCode,fp=String.fromCodePoint,lp=b([].join);Ce({target:"String",stat:!0,arity:1,forced:!!fp&&1!==fp.length},{fromCodePoint:function(t){for(var e,r=[],n=arguments.length,o=0;n>o;){if(e=+arguments[o++],he(e,1114111)!==e)throw new sp(e+" is not a valid code point");r[o]=e<65536?cp(e):cp(55296+((e-=65536)>>10),e%1024+56320)}return lp(r,"")}});var hp=b("".indexOf);Ce({target:"String",proto:!0,forced:!rp("includes")},{includes:function(t){return!!~hp(Wr(j(this)),Wr(tp(t)),arguments.length>1?arguments[1]:void 0)}}),Ze("String","includes"),b(un.String);var pp=/Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(_),vp=Xc.start;Ce({target:"String",proto:!0,forced:pp},{padStart:function(t){return vp(this,t,arguments.length>1?arguments[1]:void 0)}}),Ze("String","padStart");var dp=Xc.end;Ce({target:"String",proto:!0,forced:pp},{padEnd:function(t){return dp(this,t,arguments.length>1?arguments[1]:void 0)}}),Ze("String","padEnd");var gp=b([].push),yp=b([].join);Ce({target:"String",stat:!0},{raw:function(t){var e=k(it(t).raw),r=de(e);if(!r)return"";for(var n=arguments.length,o=[],i=0;;){if(gp(o,Wr(e[i++])),i===r)return yp(o,"");i<n&&gp(o,Wr(arguments[i]))}}}),Ce({target:"String",proto:!0},{repeat:$c}),Ze("String","repeat");var mp=Rt.f,bp=or("".slice),wp=Math.min,Sp=rp("startsWith"),Ep=!Sp&&!!function(){var t=mp(String.prototype,"startsWith");return t&&!t.writable}();Ce({target:"String",proto:!0,forced:!Ep&&!Sp},{startsWith:function(t){var e=Wr(j(this));tp(t);var r=ve(wp(arguments.length>1?arguments[1]:void 0,e.length)),n=Wr(t);return bp(e,r,r+n.length)===n}}),Ze("String","startsWith");var Op=zt.PROPER,xp=function(t){return a(function(){return!!Mi[t]()||"​᠎"!=="​᠎"[t]()||Op&&Mi[t].name!==t})},Rp=_i.start,Pp=xp("trimStart")?function(){return Rp(this)}:"".trimStart;Ce({target:"String",proto:!0,name:"trimStart",forced:"".trimLeft!==Pp},{trimLeft:Pp}),Ce({target:"String",proto:!0,name:"trimStart",forced:"".trimStart!==Pp},{trimStart:Pp}),Ze("String","trimLeft");var Ap=_i.end,jp=xp("trimEnd")?function(){return Ap(this)}:"".trimEnd;Ce({target:"String",proto:!0,name:"trimEnd",forced:"".trimRight!==jp},{trimRight:jp}),Ce({target:"String",proto:!0,name:"trimEnd",forced:"".trimEnd!==jp},{trimEnd:jp}),Ze("String","trimRight");var kp=Object.getOwnPropertyDescriptor,Ip=function(t){if(!u)return i[t];var e=kp(i,t);return e&&e.value},Tp=dt("iterator"),Mp=!a(function(){var t=new URL("b?a=1&b=2&c=3","https://a"),e=t.searchParams,r=new URLSearchParams("a=1&a=2&b=3"),n="";return t.pathname="c%20d",e.forEach(function(t,r){e.delete("b"),n+=r+t}),r.delete("a",2),r.delete("b",void 0),!e.size&&!u||!e.sort||"https://a/c%20d?a=1&c=3"!==t.href||"3"!==e.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!e[Tp]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("https://тест").host||"#%D0%B1"!==new URL("https://a#б").hash||"a1c3"!==n||"x"!==new URL("https://x",void 0).host}),Lp=TypeError,Up=function(t,e){if(t<e)throw new Lp("Not enough arguments");return t},Np=Math.floor,Cp=function(t,e){var r=t.length;if(r<8)for(var n,o,i=1;i<r;){for(o=i,n=t[i];o&&e(t[o-1],n)>0;)t[o]=t[--o];o!==i++&&(t[o]=n)}else for(var a=Np(r/2),u=Cp(vo(t,0,a),e),s=Cp(vo(t,a),e),c=u.length,f=s.length,l=0,h=0;l<c||h<f;)t[l+h]=l<c&&h<f?e(u[l],s[h])<=0?u[l++]:s[h++]:l<c?u[l++]:s[h++];return t},_p=Cp,Fp=dt("iterator"),Bp="URLSearchParams",Dp=Bp+"Iterator",zp=ne.set,Wp=ne.getterFor(Bp),qp=ne.getterFor(Dp),Hp=Ip("fetch"),$p=Ip("Request"),Kp=Ip("Headers"),Gp=$p&&$p.prototype,Vp=Kp&&Kp.prototype,Yp=i.TypeError,Xp=i.encodeURIComponent,Jp=String.fromCharCode,Qp=L("String","fromCodePoint"),Zp=parseInt,tv=b("".charAt),ev=b([].join),rv=b([].push),nv=b("".replace),ov=b([].shift),iv=b([].splice),av=b("".split),uv=b("".slice),sv=b(/./.exec),cv=/\+/g,fv=/^[0-9a-f]+$/i,lv=function(t,e){var r=uv(t,e,e+2);return sv(fv,r)?Zp(r,16):NaN},hv=function(t){for(var e=0,r=128;r>0&&0!=(t&r);r>>=1)e++;return e},pv=function(t){var e=null;switch(t.length){case 1:e=t[0];break;case 2:e=(31&t[0])<<6|63&t[1];break;case 3:e=(15&t[0])<<12|(63&t[1])<<6|63&t[2];break;case 4:e=(7&t[0])<<18|(63&t[1])<<12|(63&t[2])<<6|63&t[3]}return e>1114111?null:e},vv=function(t){for(var e=(t=nv(t,cv," ")).length,r="",n=0;n<e;){var o=tv(t,n);if("%"===o){if("%"===tv(t,n+1)||n+3>e){r+="%",n++;continue}var i=lv(t,n+1);if(i!=i){r+=o,n++;continue}n+=2;var a=hv(i);if(0===a)o=Jp(i);else{if(1===a||a>4){r+="�",n++;continue}for(var u=[i],s=1;s<a&&!(3+ ++n>e||"%"!==tv(t,n));){var c=lv(t,n+1);if(c!=c){n+=3;break}if(c>191||c<128)break;rv(u,c),n+=2,s++}if(u.length!==a){r+="�";continue}var f=pv(u);null===f?r+="�":o=Qp(f)}}r+=o,n++}return r},dv=/[!'()~]|%20/g,gv={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},yv=function(t){return gv[t]},mv=function(t){return nv(Xp(t),dv,yv)},bv=fn(function(t,e){zp(this,{type:Dp,target:Wp(t).entries,index:0,kind:e})},Bp,function(){var t=qp(this),e=t.target,r=t.index++;if(!e||r>=e.length)return t.target=null,Pn(void 0,!0);var n=e[r];switch(t.kind){case"keys":return Pn(n.key,!1);case"values":return Pn(n.value,!1)}return Pn([n.key,n.value],!1)},!0),wv=function(t){this.entries=[],this.url=null,void 0!==t&&(M(t)?this.parseObject(t):this.parseQuery("string"==typeof t?"?"===tv(t,0)?uv(t,1):t:Wr(t)))};wv.prototype={type:Bp,bindURL:function(t){this.url=t,this.update()},parseObject:function(t){var e,r,n,o,i,a,u,s=this.entries,c=Fn(t);if(c)for(r=(e=Dn(t,c)).next;!(n=f(r,e)).done;){if(o=Dn(kt(n.value)),(a=f(i=o.next,o)).done||(u=f(i,o)).done||!f(i,o).done)throw new Yp("Expected sequence with length 2");rv(s,{key:Wr(a.value),value:Wr(u.value)})}else for(var l in t)ut(t,l)&&rv(s,{key:l,value:Wr(t[l])})},parseQuery:function(t){if(t)for(var e,r,n=this.entries,o=av(t,"&"),i=0;i<o.length;)(e=o[i++]).length&&(r=av(e,"="),rv(n,{key:vv(ov(r)),value:vv(ev(r,"="))}))},serialize:function(){for(var t,e=this.entries,r=[],n=0;n<e.length;)t=e[n++],rv(r,mv(t.key)+"="+mv(t.value));return ev(r,"&")},update:function(){this.entries.length=0,this.parseQuery(this.url.query)},updateURL:function(){this.url&&this.url.update()}};var Sv=function(){ko(this,Ev);var t=zp(this,new wv(arguments.length>0?arguments[0]:void 0));u||(this.size=t.entries.length)},Ev=Sv.prototype;if(Mo(Ev,{append:function(t,e){var r=Wp(this);Up(arguments.length,2),rv(r.entries,{key:Wr(t),value:Wr(e)}),u||this.length++,r.updateURL()},delete:function(t){for(var e=Wp(this),r=Up(arguments.length,1),n=e.entries,o=Wr(t),i=r<2?void 0:arguments[1],a=void 0===i?i:Wr(i),s=0;s<n.length;){var c=n[s];if(c.key!==o||void 0!==a&&c.value!==a)s++;else if(iv(n,s,1),void 0!==a)break}u||(this.size=n.length),e.updateURL()},get:function(t){var e=Wp(this).entries;Up(arguments.length,1);for(var r=Wr(t),n=0;n<e.length;n++)if(e[n].key===r)return e[n].value;return null},getAll:function(t){var e=Wp(this).entries;Up(arguments.length,1);for(var r=Wr(t),n=[],o=0;o<e.length;o++)e[o].key===r&&rv(n,e[o].value);return n},has:function(t){for(var e=Wp(this).entries,r=Up(arguments.length,1),n=Wr(t),o=r<2?void 0:arguments[1],i=void 0===o?o:Wr(o),a=0;a<e.length;){var u=e[a++];if(u.key===n&&(void 0===i||u.value===i))return!0}return!1},set:function(t,e){var r=Wp(this);Up(arguments.length,1);for(var n,o=r.entries,i=!1,a=Wr(t),s=Wr(e),c=0;c<o.length;c++)(n=o[c]).key===a&&(i?iv(o,c--,1):(i=!0,n.value=s));i||rv(o,{key:a,value:s}),u||(this.size=o.length),r.updateURL()},sort:function(){var t=Wp(this);_p(t.entries,function(t,e){return t.key>e.key?1:-1}),t.updateURL()},forEach:function(t){for(var e,r=Wp(this).entries,n=ar(t,arguments.length>1?arguments[1]:void 0),o=0;o<r.length;)n((e=r[o++]).value,e.key,this)},keys:function(){return new bv(this,"keys")},values:function(){return new bv(this,"values")},entries:function(){return new bv(this,"entries")}},{enumerable:!0}),ie(Ev,Fp,Ev.entries,{name:"entries"}),ie(Ev,"toString",function(){return Wp(this).serialize()},{enumerable:!0}),u&&so(Ev,"size",{get:function(){return Wp(this).entries.length},configurable:!0,enumerable:!0}),an(Sv,Bp),Ce({global:!0,constructor:!0,forced:!Mp},{URLSearchParams:Sv}),!Mp&&T(Kp)){var Ov=b(Vp.has),xv=b(Vp.set),Rv=function(t){if(M(t)){var e,r=t.body;if(pr(r)===Bp)return e=t.headers?new Kp(t.headers):new Kp,Ov(e,"content-type")||xv(e,"content-type","application/x-www-form-urlencoded;charset=UTF-8"),Ve(t,{body:d(0,Wr(r)),headers:d(0,e)})}return t};if(T(Hp)&&Ce({global:!0,enumerable:!0,dontCallGetSet:!0,forced:!0},{fetch:function(t){return Hp(t,arguments.length>1?Rv(arguments[1]):{})}}),T($p)){var Pv=function(t){return ko(this,Gp),new $p(t,arguments.length>1?Rv(arguments[1]):{})};Gp.constructor=Pv,Pv.prototype=Gp,Ce({global:!0,constructor:!0,dontCallGetSet:!0,forced:!0},{Request:Pv})}}var Av={URLSearchParams:Sv,getState:Wp},jv=URLSearchParams,kv=jv.prototype,Iv=b(kv.append),Tv=b(kv.delete),Mv=b(kv.forEach),Lv=b([].push),Uv=new jv("a=1&a=2&b=3");Uv.delete("a",1),Uv.delete("b",void 0),Uv+""!="a=2"&&ie(kv,"delete",function(t){var e=arguments.length,r=e<2?void 0:arguments[1];if(e&&void 0===r)return Tv(this,t);var n=[];Mv(this,function(t,e){Lv(n,{key:e,value:t})}),Up(e,1);for(var o,i=Wr(t),a=Wr(r),u=0,s=0,c=!1,f=n.length;u<f;)o=n[u++],c||o.key===i?(c=!0,Tv(this,o.key)):s++;for(;s<f;)(o=n[s++]).key===i&&o.value===a||Iv(this,o.key,o.value)},{enumerable:!0,unsafe:!0});var Nv=URLSearchParams,Cv=Nv.prototype,_v=b(Cv.getAll),Fv=b(Cv.has),Bv=new Nv("a=1");!Bv.has("a",2)&&Bv.has("a",void 0)||ie(Cv,"has",function(t){var e=arguments.length,r=e<2?void 0:arguments[1];if(e&&void 0===r)return Fv(this,t);var n=_v(this,t);Up(e,1);for(var o=Wr(r),i=0;i<n.length;)if(n[i++]===o)return!0;return!1},{enumerable:!0,unsafe:!0});var Dv=URLSearchParams.prototype,zv=b(Dv.forEach);u&&!("size"in Dv)&&so(Dv,"size",{get:function(){var t=0;return zv(this,function(){t++}),t},configurable:!0,enumerable:!0});var Wv,qv=Object.assign,Hv=Object.defineProperty,$v=b([].concat),Kv=!qv||a(function(){if(u&&1!==qv({b:1},qv(Hv({},"a",{enumerable:!0,get:function(){Hv(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol("assign detection"),n="abcdefghijklmnopqrst";return t[r]=7,n.split("").forEach(function(t){e[t]=t}),7!==qv({},t)[r]||_e(qv({},e)).join("")!==n})?function(t,e){for(var r=it(t),n=arguments.length,o=1,i=xe.f,a=v.f;n>o;)for(var s,c=R(arguments[o++]),l=i?$v(_e(c),i(c)):_e(c),h=l.length,p=0;h>p;)s=l[p++],u&&!f(a,c,s)||(r[s]=c[s]);return r}:qv,Gv=2147483647,Vv=/[^\0-\u007E]/,Yv=/[.\u3002\uFF0E\uFF61]/g,Xv="Overflow: input needs wider integers to process",Jv=RangeError,Qv=b(Yv.exec),Zv=Math.floor,td=String.fromCharCode,ed=b("".charCodeAt),rd=b([].join),nd=b([].push),od=b("".replace),id=b("".split),ad=b("".toLowerCase),ud=function(t){return t+22+75*(t<26)},sd=function(t,e,r){var n=0;for(t=r?Zv(t/700):t>>1,t+=Zv(t/e);t>455;)t=Zv(t/35),n+=36;return Zv(n+36*t/(t+38))},cd=function(t){var e=[];t=function(t){for(var e=[],r=0,n=t.length;r<n;){var o=ed(t,r++);if(o>=55296&&o<=56319&&r<n){var i=ed(t,r++);56320==(64512&i)?nd(e,((1023&o)<<10)+(1023&i)+65536):(nd(e,o),r--)}else nd(e,o)}return e}(t);var r,n,o=t.length,i=128,a=0,u=72;for(r=0;r<t.length;r++)(n=t[r])<128&&nd(e,td(n));var s=e.length,c=s;for(s&&nd(e,"-");c<o;){var f=Gv;for(r=0;r<t.length;r++)(n=t[r])>=i&&n<f&&(f=n);var l=c+1;if(f-i>Zv((Gv-a)/l))throw new Jv(Xv);for(a+=(f-i)*l,i=f,r=0;r<t.length;r++){if((n=t[r])<i&&++a>Gv)throw new Jv(Xv);if(n===i){for(var h=a,p=36;;){var v=p<=u?1:p>=u+26?26:p-u;if(h<v)break;var d=h-v,g=36-v;nd(e,td(ud(v+d%g))),h=Zv(d/g),p+=36}nd(e,td(ud(h))),u=sd(a,l,c===s),a=0,c++}}a++,i++}return rd(e,"")},fd=Gr.codeAt,ld=ne.set,hd=ne.getterFor("URL"),pd=Av.URLSearchParams,vd=Av.getState,dd=i.URL,gd=i.TypeError,yd=i.parseInt,md=Math.floor,bd=Math.pow,wd=b("".charAt),Sd=b(/./.exec),Ed=b([].join),Od=b(1..toString),xd=b([].pop),Rd=b([].push),Pd=b("".replace),Ad=b([].shift),jd=b("".split),kd=b("".slice),Id=b("".toLowerCase),Td=b([].unshift),Md="Invalid scheme",Ld="Invalid host",Ud="Invalid port",Nd=/[a-z]/i,Cd=/[\d+-.a-z]/i,_d=/\d/,Fd=/^0x/i,Bd=/^[0-7]+$/,Dd=/^\d+$/,zd=/^[\da-f]+$/i,Wd=/[\0\t\n\r #%/:<>?@[\\\]^|]/,qd=/[\0\t\n\r #/:<>?@[\\\]^|]/,Hd=/^[\u0000-\u0020]+/,$d=/(^|[^\u0000-\u0020])[\u0000-\u0020]+$/,Kd=/[\t\n\r]/g,Gd=function(t){var e,r,n,o;if("number"==typeof t){for(e=[],r=0;r<4;r++)Td(e,t%256),t=md(t/256);return Ed(e,".")}if("object"==typeof t){for(e="",n=function(t){for(var e=null,r=1,n=null,o=0,i=0;i<8;i++)0!==t[i]?(o>r&&(e=n,r=o),n=null,o=0):(null===n&&(n=i),++o);return o>r?n:e}(t),r=0;r<8;r++)o&&0===t[r]||(o&&(o=!1),n===r?(e+=r?":":"::",o=!0):(e+=Od(t[r],16),r<7&&(e+=":")));return"["+e+"]"}return t},Vd={},Yd=Kv({},Vd,{" ":1,'"':1,"<":1,">":1,"`":1}),Xd=Kv({},Yd,{"#":1,"?":1,"{":1,"}":1}),Jd=Kv({},Xd,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),Qd=function(t,e){var r=fd(t,0);return r>32&&r<127&&!ut(e,t)?t:encodeURIComponent(t)},Zd={ftp:21,file:null,http:80,https:443,ws:80,wss:443},tg=function(t,e){var r;return 2===t.length&&Sd(Nd,wd(t,0))&&(":"===(r=wd(t,1))||!e&&"|"===r)},eg=function(t){var e;return t.length>1&&tg(kd(t,0,2))&&(2===t.length||"/"===(e=wd(t,2))||"\\"===e||"?"===e||"#"===e)},rg=function(t){return"."===t||"%2e"===Id(t)},ng={},og={},ig={},ag={},ug={},sg={},cg={},fg={},lg={},hg={},pg={},vg={},dg={},gg={},yg={},mg={},bg={},wg={},Sg={},Eg={},Og={},xg=function(t,e,r){var n,o,i,a=Wr(t);if(e){if(o=this.parse(a))throw new gd(o);this.searchParams=null}else{if(void 0!==r&&(n=new xg(r,!0)),o=this.parse(a,null,n))throw new gd(o);(i=vd(new pd)).bindURL(this),this.searchParams=i}};xg.prototype={type:"URL",parse:function(t,e,r){var n,o,i,a,u,s=this,c=e||ng,f=0,l="",h=!1,p=!1,v=!1;for(t=Wr(t),e||(s.scheme="",s.username="",s.password="",s.host=null,s.port=null,s.path=[],s.query=null,s.fragment=null,s.cannotBeABaseURL=!1,t=Pd(t,Hd,""),t=Pd(t,$d,"$1")),t=Pd(t,Kd,""),n=Wn(t);f<=n.length;){switch(o=n[f],c){case ng:if(!o||!Sd(Nd,o)){if(e)return Md;c=ig;continue}l+=Id(o),c=og;break;case og:if(o&&(Sd(Cd,o)||"+"===o||"-"===o||"."===o))l+=Id(o);else{if(":"!==o){if(e)return Md;l="",c=ig,f=0;continue}if(e&&(s.isSpecial()!==ut(Zd,l)||"file"===l&&(s.includesCredentials()||null!==s.port)||"file"===s.scheme&&!s.host))return;if(s.scheme=l,e)return void(s.isSpecial()&&Zd[s.scheme]===s.port&&(s.port=null));l="","file"===s.scheme?c=gg:s.isSpecial()&&r&&r.scheme===s.scheme?c=ag:s.isSpecial()?c=fg:"/"===n[f+1]?(c=ug,f++):(s.cannotBeABaseURL=!0,Rd(s.path,""),c=Sg)}break;case ig:if(!r||r.cannotBeABaseURL&&"#"!==o)return Md;if(r.cannotBeABaseURL&&"#"===o){s.scheme=r.scheme,s.path=vo(r.path),s.query=r.query,s.fragment="",s.cannotBeABaseURL=!0,c=Og;break}c="file"===r.scheme?gg:sg;continue;case ag:if("/"!==o||"/"!==n[f+1]){c=sg;continue}c=lg,f++;break;case ug:if("/"===o){c=hg;break}c=wg;continue;case sg:if(s.scheme=r.scheme,o===Wv)s.username=r.username,s.password=r.password,s.host=r.host,s.port=r.port,s.path=vo(r.path),s.query=r.query;else if("/"===o||"\\"===o&&s.isSpecial())c=cg;else if("?"===o)s.username=r.username,s.password=r.password,s.host=r.host,s.port=r.port,s.path=vo(r.path),s.query="",c=Eg;else{if("#"!==o){s.username=r.username,s.password=r.password,s.host=r.host,s.port=r.port,s.path=vo(r.path),s.path.length--,c=wg;continue}s.username=r.username,s.password=r.password,s.host=r.host,s.port=r.port,s.path=vo(r.path),s.query=r.query,s.fragment="",c=Og}break;case cg:if(!s.isSpecial()||"/"!==o&&"\\"!==o){if("/"!==o){s.username=r.username,s.password=r.password,s.host=r.host,s.port=r.port,c=wg;continue}c=hg}else c=lg;break;case fg:if(c=lg,"/"!==o||"/"!==wd(l,f+1))continue;f++;break;case lg:if("/"!==o&&"\\"!==o){c=hg;continue}break;case hg:if("@"===o){h&&(l="%40"+l),h=!0,i=Wn(l);for(var d=0;d<i.length;d++){var g=i[d];if(":"!==g||v){var y=Qd(g,Jd);v?s.password+=y:s.username+=y}else v=!0}l=""}else if(o===Wv||"/"===o||"?"===o||"#"===o||"\\"===o&&s.isSpecial()){if(h&&""===l)return"Invalid authority";f-=Wn(l).length+1,l="",c=pg}else l+=o;break;case pg:case vg:if(e&&"file"===s.scheme){c=mg;continue}if(":"!==o||p){if(o===Wv||"/"===o||"?"===o||"#"===o||"\\"===o&&s.isSpecial()){if(s.isSpecial()&&""===l)return Ld;if(e&&""===l&&(s.includesCredentials()||null!==s.port))return;if(a=s.parseHost(l))return a;if(l="",c=bg,e)return;continue}"["===o?p=!0:"]"===o&&(p=!1),l+=o}else{if(""===l)return Ld;if(a=s.parseHost(l))return a;if(l="",c=dg,e===vg)return}break;case dg:if(!Sd(_d,o)){if(o===Wv||"/"===o||"?"===o||"#"===o||"\\"===o&&s.isSpecial()||e){if(""!==l){var m=yd(l,10);if(m>65535)return Ud;s.port=s.isSpecial()&&m===Zd[s.scheme]?null:m,l=""}if(e)return;c=bg;continue}return Ud}l+=o;break;case gg:if(s.scheme="file","/"===o||"\\"===o)c=yg;else{if(!r||"file"!==r.scheme){c=wg;continue}switch(o){case Wv:s.host=r.host,s.path=vo(r.path),s.query=r.query;break;case"?":s.host=r.host,s.path=vo(r.path),s.query="",c=Eg;break;case"#":s.host=r.host,s.path=vo(r.path),s.query=r.query,s.fragment="",c=Og;break;default:eg(Ed(vo(n,f),""))||(s.host=r.host,s.path=vo(r.path),s.shortenPath()),c=wg;continue}}break;case yg:if("/"===o||"\\"===o){c=mg;break}r&&"file"===r.scheme&&!eg(Ed(vo(n,f),""))&&(tg(r.path[0],!0)?Rd(s.path,r.path[0]):s.host=r.host),c=wg;continue;case mg:if(o===Wv||"/"===o||"\\"===o||"?"===o||"#"===o){if(!e&&tg(l))c=wg;else if(""===l){if(s.host="",e)return;c=bg}else{if(a=s.parseHost(l))return a;if("localhost"===s.host&&(s.host=""),e)return;l="",c=bg}continue}l+=o;break;case bg:if(s.isSpecial()){if(c=wg,"/"!==o&&"\\"!==o)continue}else if(e||"?"!==o)if(e||"#"!==o){if(o!==Wv&&(c=wg,"/"!==o))continue}else s.fragment="",c=Og;else s.query="",c=Eg;break;case wg:if(o===Wv||"/"===o||"\\"===o&&s.isSpecial()||!e&&("?"===o||"#"===o)){if(".."===(u=Id(u=l))||"%2e."===u||".%2e"===u||"%2e%2e"===u?(s.shortenPath(),"/"===o||"\\"===o&&s.isSpecial()||Rd(s.path,"")):rg(l)?"/"===o||"\\"===o&&s.isSpecial()||Rd(s.path,""):("file"===s.scheme&&!s.path.length&&tg(l)&&(s.host&&(s.host=""),l=wd(l,0)+":"),Rd(s.path,l)),l="","file"===s.scheme&&(o===Wv||"?"===o||"#"===o))for(;s.path.length>1&&""===s.path[0];)Ad(s.path);"?"===o?(s.query="",c=Eg):"#"===o&&(s.fragment="",c=Og)}else l+=Qd(o,Xd);break;case Sg:"?"===o?(s.query="",c=Eg):"#"===o?(s.fragment="",c=Og):o!==Wv&&(s.path[0]+=Qd(o,Vd));break;case Eg:e||"#"!==o?o!==Wv&&("'"===o&&s.isSpecial()?s.query+="%27":s.query+="#"===o?"%23":Qd(o,Vd)):(s.fragment="",c=Og);break;case Og:o!==Wv&&(s.fragment+=Qd(o,Yd))}f++}},parseHost:function(t){var e,r,n;if("["===wd(t,0)){if("]"!==wd(t,t.length-1))return Ld;if(e=function(t){var e,r,n,o,i,a,u,s=[0,0,0,0,0,0,0,0],c=0,f=null,l=0,h=function(){return wd(t,l)};if(":"===h()){if(":"!==wd(t,1))return;l+=2,f=++c}for(;h();){if(8===c)return;if(":"!==h()){for(e=r=0;r<4&&Sd(zd,h());)e=16*e+yd(h(),16),l++,r++;if("."===h()){if(0===r)return;if(l-=r,c>6)return;for(n=0;h();){if(o=null,n>0){if(!("."===h()&&n<4))return;l++}if(!Sd(_d,h()))return;for(;Sd(_d,h());){if(i=yd(h(),10),null===o)o=i;else{if(0===o)return;o=10*o+i}if(o>255)return;l++}s[c]=256*s[c]+o,2!=++n&&4!==n||c++}if(4!==n)return;break}if(":"===h()){if(l++,!h())return}else if(h())return;s[c++]=e}else{if(null!==f)return;l++,f=++c}}if(null!==f)for(a=c-f,c=7;0!==c&&a>0;)u=s[c],s[c--]=s[f+a-1],s[f+--a]=u;else if(8!==c)return;return s}(kd(t,1,-1)),!e)return Ld;this.host=e}else if(this.isSpecial()){if(t=function(t){var e,r,n=[],o=id(od(ad(t),Yv,"."),".");for(e=0;e<o.length;e++)nd(n,Qv(Vv,r=o[e])?"xn--"+cd(r):r);return rd(n,".")}(t),Sd(Wd,t))return Ld;if(e=function(t){var e,r,n,o,i,a,u,s=jd(t,".");if(s.length&&""===s[s.length-1]&&s.length--,(e=s.length)>4)return t;for(r=[],n=0;n<e;n++){if(""===(o=s[n]))return t;if(i=10,o.length>1&&"0"===wd(o,0)&&(i=Sd(Fd,o)?16:8,o=kd(o,8===i?1:2)),""===o)a=0;else{if(!Sd(10===i?Dd:8===i?Bd:zd,o))return t;a=yd(o,i)}Rd(r,a)}for(n=0;n<e;n++)if(a=r[n],n===e-1){if(a>=bd(256,5-e))return null}else if(a>255)return null;for(u=xd(r),n=0;n<r.length;n++)u+=r[n]*bd(256,3-n);return u}(t),null===e)return Ld;this.host=e}else{if(Sd(qd,t))return Ld;for(e="",r=Wn(t),n=0;n<r.length;n++)e+=Qd(r[n],Vd);this.host=e}},cannotHaveUsernamePasswordPort:function(){return!this.host||this.cannotBeABaseURL||"file"===this.scheme},includesCredentials:function(){return""!==this.username||""!==this.password},isSpecial:function(){return ut(Zd,this.scheme)},shortenPath:function(){var t=this.path,e=t.length;!e||"file"===this.scheme&&1===e&&tg(t[0],!0)||t.length--},serialize:function(){var t=this,e=t.scheme,r=t.username,n=t.password,o=t.host,i=t.port,a=t.path,u=t.query,s=t.fragment,c=e+":";return null!==o?(c+="//",t.includesCredentials()&&(c+=r+(n?":"+n:"")+"@"),c+=Gd(o),null!==i&&(c+=":"+i)):"file"===e&&(c+="//"),c+=t.cannotBeABaseURL?a[0]:a.length?"/"+Ed(a,"/"):"",null!==u&&(c+="?"+u),null!==s&&(c+="#"+s),c},setHref:function(t){var e=this.parse(t);if(e)throw new gd(e);this.searchParams.update()},getOrigin:function(){var t=this.scheme,e=this.port;if("blob"===t)try{return new Rg(t.path[0]).origin}catch(t){return"null"}return"file"!==t&&this.isSpecial()?t+"://"+Gd(this.host)+(null!==e?":"+e:""):"null"},getProtocol:function(){return this.scheme+":"},setProtocol:function(t){this.parse(Wr(t)+":",ng)},getUsername:function(){return this.username},setUsername:function(t){var e=Wn(Wr(t));if(!this.cannotHaveUsernamePasswordPort()){this.username="";for(var r=0;r<e.length;r++)this.username+=Qd(e[r],Jd)}},getPassword:function(){return this.password},setPassword:function(t){var e=Wn(Wr(t));if(!this.cannotHaveUsernamePasswordPort()){this.password="";for(var r=0;r<e.length;r++)this.password+=Qd(e[r],Jd)}},getHost:function(){var t=this.host,e=this.port;return null===t?"":null===e?Gd(t):Gd(t)+":"+e},setHost:function(t){this.cannotBeABaseURL||this.parse(t,pg)},getHostname:function(){var t=this.host;return null===t?"":Gd(t)},setHostname:function(t){this.cannotBeABaseURL||this.parse(t,vg)},getPort:function(){var t=this.port;return null===t?"":Wr(t)},setPort:function(t){this.cannotHaveUsernamePasswordPort()||(""===(t=Wr(t))?this.port=null:this.parse(t,dg))},getPathname:function(){var t=this.path;return this.cannotBeABaseURL?t[0]:t.length?"/"+Ed(t,"/"):""},setPathname:function(t){this.cannotBeABaseURL||(this.path=[],this.parse(t,bg))},getSearch:function(){var t=this.query;return t?"?"+t:""},setSearch:function(t){""===(t=Wr(t))?this.query=null:("?"===wd(t,0)&&(t=kd(t,1)),this.query="",this.parse(t,Eg)),this.searchParams.update()},getSearchParams:function(){return this.searchParams.facade},getHash:function(){var t=this.fragment;return t?"#"+t:""},setHash:function(t){""!==(t=Wr(t))?("#"===wd(t,0)&&(t=kd(t,1)),this.fragment="",this.parse(t,Og)):this.fragment=null},update:function(){this.query=this.searchParams.serialize()||null}};var Rg=function(t){var e=ko(this,Pg),r=Up(arguments.length,1)>1?arguments[1]:void 0,n=ld(e,new xg(t,!1,r));u||(e.href=n.serialize(),e.origin=n.getOrigin(),e.protocol=n.getProtocol(),e.username=n.getUsername(),e.password=n.getPassword(),e.host=n.getHost(),e.hostname=n.getHostname(),e.port=n.getPort(),e.pathname=n.getPathname(),e.search=n.getSearch(),e.searchParams=n.getSearchParams(),e.hash=n.getHash())},Pg=Rg.prototype,Ag=function(t,e){return{get:function(){return hd(this)[t]()},set:e&&function(t){return hd(this)[e](t)},configurable:!0,enumerable:!0}};if(u&&(so(Pg,"href",Ag("serialize","setHref")),so(Pg,"origin",Ag("getOrigin")),so(Pg,"protocol",Ag("getProtocol","setProtocol")),so(Pg,"username",Ag("getUsername","setUsername")),so(Pg,"password",Ag("getPassword","setPassword")),so(Pg,"host",Ag("getHost","setHost")),so(Pg,"hostname",Ag("getHostname","setHostname")),so(Pg,"port",Ag("getPort","setPort")),so(Pg,"pathname",Ag("getPathname","setPathname")),so(Pg,"search",Ag("getSearch","setSearch")),so(Pg,"searchParams",Ag("getSearchParams")),so(Pg,"hash",Ag("getHash","setHash"))),ie(Pg,"toJSON",function(){return hd(this).serialize()},{enumerable:!0}),ie(Pg,"toString",function(){return hd(this).serialize()},{enumerable:!0}),dd){var jg=dd.createObjectURL,kg=dd.revokeObjectURL;jg&&ie(Rg,"createObjectURL",ar(jg,dd)),kg&&ie(Rg,"revokeObjectURL",ar(kg,dd))}an(Rg,"URL"),Ce({global:!0,constructor:!0,forced:!Mp,sham:!u},{URL:Rg});var Ig=L("URL"),Tg=Mp&&a(function(){Ig.canParse()}),Mg=a(function(){return 1!==Ig.canParse.length});Ce({target:"URL",stat:!0,forced:!Tg||Mg},{canParse:function(t){var e=Up(arguments.length,1),r=Wr(t),n=e<2||void 0===arguments[1]?void 0:Wr(arguments[1]);try{return!!new Ig(r,n)}catch(t){return!1}}});var Lg=L("URL");Ce({target:"URL",stat:!0,forced:!Mp},{parse:function(t){var e=Up(arguments.length,1),r=Wr(t),n=e<2||void 0===arguments[1]?void 0:Wr(arguments[1]);try{return new Lg(r,n)}catch(t){return null}}}),Ce({target:"URL",proto:!0,enumerable:!0},{toJSON:function(){return f(URL.prototype.toString,this)}});var Ug=WeakMap.prototype,Ng={WeakMap:WeakMap,set:b(Ug.set),get:b(Ug.get),has:b(Ug.has),remove:b(Ug.delete)},Cg=Ng.has,_g=function(t){return Cg(t),t},Fg=Ng.get,Bg=Ng.has,Dg=Ng.set;Ce({target:"WeakMap",proto:!0,real:!0,forced:!0},{emplace:function(t,e){var r,n,o=_g(this);return Bg(o,t)?(r=Fg(o,t),"update"in e&&(r=e.update(r,t,o),Dg(o,t,r)),r):(n=e.insert(t,o),Dg(o,t,n),n)}}),Ce({target:"WeakMap",stat:!0,forced:!0},{from:ei(Ng.WeakMap,Ng.set,!0)}),Ce({target:"WeakMap",stat:!0,forced:!0},{of:ri(Ng.WeakMap,Ng.set,!0)});var zg=Ng.remove;Ce({target:"WeakMap",proto:!0,real:!0,forced:!0},{deleteAll:function(){for(var t,e=_g(this),r=!0,n=0,o=arguments.length;n<o;n++)t=zg(e,arguments[n]),r=r&&t;return!!r}}),Ce({target:"WeakMap",proto:!0,real:!0,forced:!0},{upsert:Ii}),To("WeakSet",function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}},eu);var Wg=WeakSet.prototype,qg={WeakSet:WeakSet,add:b(Wg.add),has:b(Wg.has),remove:b(Wg.delete)},Hg=qg.has,$g=function(t){return Hg(t),t},Kg=qg.add;Ce({target:"WeakSet",proto:!0,real:!0,forced:!0},{addAll:function(){for(var t=$g(this),e=0,r=arguments.length;e<r;e++)Kg(t,arguments[e]);return t}});var Gg=qg.remove;Ce({target:"WeakSet",proto:!0,real:!0,forced:!0},{deleteAll:function(){for(var t,e=$g(this),r=!0,n=0,o=arguments.length;n<o;n++)t=Gg(e,arguments[n]),r=r&&t;return!!r}}),Ce({target:"WeakSet",stat:!0,forced:!0},{from:ei(qg.WeakSet,qg.add,!1)}),Ce({target:"WeakSet",stat:!0,forced:!0},{of:ri(qg.WeakSet,qg.add,!1)});var Vg=Error,Yg=b("".replace),Xg=String(new Vg("zxcasd").stack),Jg=/\n\s*at [^:]*:[^\n]*/,Qg=Jg.test(Xg),Zg=!a(function(){var t=new Error("a");return!("stack"in t)||(Object.defineProperty(t,"stack",d(1,7)),7!==t.stack)}),ty=Error.captureStackTrace,ey=dt("toStringTag"),ry=Error,ny=[].push,oy=function(t,e){var r,n,o,i,a,u=U(iy,this);dn?r=dn(new ry,u?Qr(this):iy):(r=u?this:Ve(iy),_t(r,ey,"Error")),void 0!==e&&_t(r,"message",function(t,e){return void 0===t?arguments.length<2?"":e:Wr(t)}(e)),i=r,a=r.stack,Zg&&(ty?ty(i,oy):_t(i,"stack",function(t,e){if(Qg&&"string"==typeof t&&!Vg.prepareStackTrace)for(;e--;)t=Yg(t,Jg,"");return t}(a,1))),arguments.length>2&&(n=r,M(o=arguments[2])&&"cause"in o&&_t(n,"cause",o.cause));var s=[];return Ao(t,ny,{that:s}),_t(r,"errors",s),r};dn?dn(oy,ry):Ae(oy,ry,{name:!0});var iy=oy.prototype=Ve(ry.prototype,{constructor:d(1,oy),message:d(1,""),name:d(1,"AggregateError")});Ce({global:!0,constructor:!0,arity:2},{AggregateError:oy});var ay,uy,sy,cy,fy=function(t){return _.slice(0,t.length)===t},ly=fy("Bun/")?"BUN":fy("Cloudflare-Workers")?"CLOUDFLARE":fy("Deno/")?"DENO":fy("Node.js/")?"NODE":i.Bun&&"string"==typeof Bun.version?"BUN":i.Deno&&"object"==typeof Deno.version?"DENO":"process"===E(i.process)?"NODE":i.window&&i.document?"BROWSER":"REST",hy="NODE"===ly,py=/(?:ipad|iphone|ipod).*applewebkit/i.test(_),vy=i.setImmediate,dy=i.clearImmediate,gy=i.process,yy=i.Dispatch,my=i.Function,by=i.MessageChannel,wy=i.String,Sy=0,Ey={},Oy="onreadystatechange";a(function(){ay=i.location});var xy=function(t){if(ut(Ey,t)){var e=Ey[t];delete Ey[t],e()}},Ry=function(t){return function(){xy(t)}},Py=function(t){xy(t.data)},Ay=function(t){i.postMessage(wy(t),ay.protocol+"//"+ay.host)};vy&&dy||(vy=function(t){Up(arguments.length,1);var e=T(t)?t:my(t),r=vo(arguments,1);return Ey[++Sy]=function(){Ra(e,void 0,r)},uy(Sy),Sy},dy=function(t){delete Ey[t]},hy?uy=function(t){gy.nextTick(Ry(t))}:yy&&yy.now?uy=function(t){yy.now(Ry(t))}:by&&!py?(cy=(sy=new by).port2,sy.port1.onmessage=Py,uy=ar(cy.postMessage,cy)):i.addEventListener&&T(i.postMessage)&&!i.importScripts&&ay&&"file:"!==ay.protocol&&!a(Ay)?(uy=Ay,i.addEventListener("message",Py,!1)):uy=Oy in Et("script")?function(t){De.appendChild(Et("script"))[Oy]=function(){De.removeChild(this),xy(t)}}:function(t){setTimeout(Ry(t),0)});var jy={set:vy,clear:dy},ky=function(){this.head=null,this.tail=null};ky.prototype={add:function(t){var e={item:t,next:null},r=this.tail;r?r.next=e:this.head=e,this.tail=e},get:function(){var t=this.head;if(t)return null===(this.head=t.next)&&(this.tail=null),t.item}};var Iy,Ty,My,Ly,Uy,Ny=ky,Cy=/ipad|iphone|ipod/i.test(_)&&"undefined"!=typeof Pebble,_y=/web0s(?!.*chrome)/i.test(_),Fy=jy.set,By=i.MutationObserver||i.WebKitMutationObserver,Dy=i.document,zy=i.process,Wy=i.Promise,qy=Ip("queueMicrotask");if(!qy){var Hy=new Ny,$y=function(){var t,e;for(hy&&(t=zy.domain)&&t.exit();e=Hy.get();)try{e()}catch(t){throw Hy.head&&Iy(),t}t&&t.enter()};py||hy||_y||!By||!Dy?!Cy&&Wy&&Wy.resolve?((Ly=Wy.resolve(void 0)).constructor=Wy,Uy=ar(Ly.then,Ly),Iy=function(){Uy($y)}):hy?Iy=function(){zy.nextTick($y)}:(Fy=ar(Fy,i),Iy=function(){Fy($y)}):(Ty=!0,My=Dy.createTextNode(""),new By($y).observe(My,{characterData:!0}),Iy=function(){My.data=Ty=!Ty}),qy=function(t){Hy.head||Iy(),Hy.add(t)}}var Ky,Gy,Vy,Yy=qy,Xy=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}},Jy=i.Promise,Qy=dt("species"),Zy=!1,tm=T(i.PromiseRejectionEvent),em=Ue("Promise",function(){var t=Kt(Jy),e=t!==String(Jy);if(!e&&66===W)return!0;if(!W||W<51||!/native code/.test(t)){var r=new Jy(function(t){t(1)}),n=function(t){t(function(){},function(){})};if((r.constructor={})[Qy]=n,!(Zy=r.then(function(){})instanceof n))return!0}return!(e||"BROWSER"!==ly&&"DENO"!==ly||tm)}),rm={CONSTRUCTOR:em,REJECTION_EVENT:tm,SUBCLASSING:Zy},nm=TypeError,om=function(t){var e,r;this.promise=new t(function(t,n){if(void 0!==e||void 0!==r)throw new nm("Bad Promise constructor");e=t,r=n}),this.resolve=J(e),this.reject=J(r)},im={f:function(t){return new om(t)}},am=jy.set,um="Promise",sm=rm.CONSTRUCTOR,cm=rm.REJECTION_EVENT,fm=rm.SUBCLASSING,lm=ne.getterFor(um),hm=ne.set,pm=Jy&&Jy.prototype,vm=Jy,dm=pm,gm=i.TypeError,ym=i.document,mm=i.process,bm=im.f,wm=bm,Sm=!!(ym&&ym.createEvent&&i.dispatchEvent),Em="unhandledrejection",Om=function(t){var e;return!(!M(t)||!T(e=t.then))&&e},xm=function(t,e){var r,n,o,i=e.value,a=1===e.state,u=a?t.ok:t.fail,s=t.resolve,c=t.reject,l=t.domain;try{u?(a||(2===e.rejection&&km(e),e.rejection=1),!0===u?r=i:(l&&l.enter(),r=u(i),l&&(l.exit(),o=!0)),r===t.promise?c(new gm("Promise-chain cycle")):(n=Om(r))?f(n,r,s,c):s(r)):c(i)}catch(t){l&&!o&&l.exit(),c(t)}},Rm=function(t,e){t.notified||(t.notified=!0,Yy(function(){for(var r,n=t.reactions;r=n.get();)xm(r,t);t.notified=!1,e&&!t.rejection&&Am(t)}))},Pm=function(t,e,r){var n,o;Sm?((n=ym.createEvent("Event")).promise=e,n.reason=r,n.initEvent(t,!1,!0),i.dispatchEvent(n)):n={promise:e,reason:r},!cm&&(o=i["on"+t])?o(n):t===Em&&function(t,e){try{1===arguments.length?console.error(t):console.error(t,e)}catch(t){}}("Unhandled promise rejection",r)},Am=function(t){f(am,i,function(){var e,r=t.facade,n=t.value;if(jm(t)&&(e=Xy(function(){hy?mm.emit("unhandledRejection",n,r):Pm(Em,r,n)}),t.rejection=hy||jm(t)?2:1,e.error))throw e.value})},jm=function(t){return 1!==t.rejection&&!t.parent},km=function(t){f(am,i,function(){var e=t.facade;hy?mm.emit("rejectionHandled",e):Pm("rejectionhandled",e,t.value)})},Im=function(t,e,r){return function(n){t(e,n,r)}},Tm=function(t,e,r){t.done||(t.done=!0,r&&(t=r),t.value=e,t.state=2,Rm(t,!0))},Mm=function(t,e,r){if(!t.done){t.done=!0,r&&(t=r);try{if(t.facade===e)throw new gm("Promise can't be resolved itself");var n=Om(e);n?Yy(function(){var r={done:!1};try{f(n,e,Im(Mm,r,t),Im(Tm,r,t))}catch(e){Tm(r,e,t)}}):(t.value=e,t.state=1,Rm(t,!1))}catch(e){Tm({done:!1},e,t)}}};if(sm&&(vm=function(t){ko(this,dm),J(t),f(Ky,this);var e=lm(this);try{t(Im(Mm,e),Im(Tm,e))}catch(t){Tm(e,t)}},(Ky=function(t){hm(this,{type:um,done:!1,notified:!1,parent:!1,reactions:new Ny,rejection:!1,state:0,value:null})}).prototype=ie(dm=vm.prototype,"then",function(t,e){var r=lm(this),n=bm(Cc(this,vm));return r.parent=!0,n.ok=!T(t)||t,n.fail=T(e)&&e,n.domain=hy?mm.domain:void 0,0===r.state?r.reactions.add(n):Yy(function(){xm(n,r)}),n.promise}),Gy=function(){var t=new Ky,e=lm(t);this.promise=t,this.resolve=Im(Mm,e),this.reject=Im(Tm,e)},im.f=bm=function(t){return t===vm||void 0===t?new Gy(t):wm(t)},T(Jy)&&pm!==Object.prototype)){Vy=pm.then,fm||ie(pm,"then",function(t,e){var r=this;return new vm(function(t,e){f(Vy,r,t,e)}).then(t,e)},{unsafe:!0});try{delete pm.constructor}catch(t){}dn&&dn(pm,dm)}Ce({global:!0,constructor:!0,wrap:!0,forced:sm},{Promise:vm}),an(vm,um,!1),Uo(um);var Lm=rm.CONSTRUCTOR||!Gn(function(t){Jy.all(t).then(void 0,function(){})});Ce({target:"Promise",stat:!0,forced:Lm},{all:function(t){var e=this,r=im.f(e),n=r.resolve,o=r.reject,i=Xy(function(){var r=J(e.resolve),i=[],a=0,u=1;Ao(t,function(t){var s=a++,c=!1;u++,f(r,e,t).then(function(t){c||(c=!0,i[s]=t,--u||n(i))},o)}),--u||n(i)});return i.error&&o(i.value),r.promise}});var Um=Jy&&Jy.prototype;if(Ce({target:"Promise",proto:!0,forced:rm.CONSTRUCTOR,real:!0},{catch:function(t){return this.then(void 0,t)}}),T(Jy)){var Nm=L("Promise").prototype.catch;Um.catch!==Nm&&ie(Um,"catch",Nm,{unsafe:!0})}Ce({target:"Promise",stat:!0,forced:Lm},{race:function(t){var e=this,r=im.f(e),n=r.reject,o=Xy(function(){var o=J(e.resolve);Ao(t,function(t){f(o,e,t).then(r.resolve,n)})});return o.error&&n(o.value),r.promise}}),Ce({target:"Promise",stat:!0,forced:rm.CONSTRUCTOR},{reject:function(t){var e=im.f(this);return(0,e.reject)(t),e.promise}});var Cm=function(t,e){if(kt(t),M(e)&&e.constructor===t)return e;var r=im.f(t);return(0,r.resolve)(e),r.promise};Ce({target:"Promise",stat:!0,forced:rm.CONSTRUCTOR},{resolve:function(t){return Cm(this,t)}}),Ce({target:"Promise",stat:!0,forced:Lm},{allSettled:function(t){var e=this,r=im.f(e),n=r.resolve,o=r.reject,i=Xy(function(){var r=J(e.resolve),o=[],i=0,a=1;Ao(t,function(t){var u=i++,s=!1;a++,f(r,e,t).then(function(t){s||(s=!0,o[u]={status:"fulfilled",value:t},--a||n(o))},function(t){s||(s=!0,o[u]={status:"rejected",reason:t},--a||n(o))})}),--a||n(o)});return i.error&&o(i.value),r.promise}});var _m="No one promise resolved";Ce({target:"Promise",stat:!0,forced:Lm},{any:function(t){var e=this,r=L("AggregateError"),n=im.f(e),o=n.resolve,i=n.reject,a=Xy(function(){var n=J(e.resolve),a=[],u=0,s=1,c=!1;Ao(t,function(t){var l=u++,h=!1;s++,f(n,e,t).then(function(t){h||c||(c=!0,o(t))},function(t){h||c||(h=!0,a[l]=t,--s||i(new r(a,_m)))})}),--s||i(new r(a,_m))});return a.error&&i(a.value),n.promise}}),Ce({target:"Promise",stat:!0},{withResolvers:function(){var t=im.f(this);return{promise:t.promise,resolve:t.resolve,reject:t.reject}}});var Fm=Jy&&Jy.prototype,Bm=!!Jy&&a(function(){Fm.finally.call({then:function(){}},function(){})});if(Ce({target:"Promise",proto:!0,real:!0,forced:Bm},{finally:function(t){var e=Cc(this,L("Promise")),r=T(t);return this.then(r?function(r){return Cm(e,t()).then(function(){return r})}:t,r?function(r){return Cm(e,t()).then(function(){throw r})}:t)}}),T(Jy)){var Dm=L("Promise").prototype.finally;Fm.finally!==Dm&&ie(Fm,"finally",Dm,{unsafe:!0})}var zm=i.Promise,Wm=!1,qm=!zm||!zm.try||Xy(function(){zm.try(function(t){Wm=8===t},8)}).error||!Wm;Ce({target:"Promise",stat:!0,forced:qm},{try:function(t){var e=arguments.length>1?vo(arguments,1):[],r=im.f(this),n=Xy(function(){return Ra(J(t),void 0,e)});return(n.error?r.reject:r.resolve)(n.value),r.promise}}),Ze("Promise","finally");var Hm="URLSearchParams"in self,$m="Symbol"in self&&"iterator"in Symbol,Km="FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),Gm="FormData"in self,Vm="ArrayBuffer"in self;if(Vm)var Ym=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],Xm=ArrayBuffer.isView||function(t){return t&&Ym.indexOf(Object.prototype.toString.call(t))>-1};function Jm(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function Qm(t){return"string"!=typeof t&&(t=String(t)),t}function Zm(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return $m&&(e[Symbol.iterator]=function(){return e}),e}function tb(t){this.map={},t instanceof tb?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function eb(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function rb(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function nb(t){var e=new FileReader,r=rb(e);return e.readAsArrayBuffer(t),r}function ob(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function ib(){return this.bodyUsed=!1,this._initBody=function(t){var e;this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:Km&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:Gm&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:Hm&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():Vm&&Km&&(e=t)&&DataView.prototype.isPrototypeOf(e)?(this._bodyArrayBuffer=ob(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):Vm&&(ArrayBuffer.prototype.isPrototypeOf(t)||Xm(t))?this._bodyArrayBuffer=ob(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):Hm&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},Km&&(this.blob=function(){var t=eb(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?eb(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(nb)}),this.text=function(){var t=eb(this);if(t)return t;if(this._bodyBlob)return function(t){var e=new FileReader,r=rb(e);return e.readAsText(t),r}(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},Gm&&(this.formData=function(){return this.text().then(sb)}),this.json=function(){return this.text().then(JSON.parse)},this}tb.prototype.append=function(t,e){t=Jm(t),e=Qm(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},tb.prototype.delete=function(t){delete this.map[Jm(t)]},tb.prototype.get=function(t){return t=Jm(t),this.has(t)?this.map[t]:null},tb.prototype.has=function(t){return this.map.hasOwnProperty(Jm(t))},tb.prototype.set=function(t,e){this.map[Jm(t)]=Qm(e)},tb.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},tb.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),Zm(t)},tb.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),Zm(t)},tb.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),Zm(t)},$m&&(tb.prototype[Symbol.iterator]=tb.prototype.entries);var ab=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function ub(t,e){var r=(e=e||{}).body;if(t instanceof ub){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new tb(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,r||null==t._bodyInit||(r=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new tb(e.headers)),this.method=function(t){var e=t.toUpperCase();return ab.indexOf(e)>-1?e:t}(e.method||this.method||"GET"),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&r)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(r)}function sb(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}}),e}function cb(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new tb(e.headers),this.url=e.url||"",this._initBody(t)}ub.prototype.clone=function(){return new ub(this,{body:this._bodyInit})},ib.call(ub.prototype),ib.call(cb.prototype),cb.prototype.clone=function(){return new cb(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new tb(this.headers),url:this.url})},cb.error=function(){var t=new cb(null,{status:0,statusText:""});return t.type="error",t};var fb=[301,302,303,307,308];cb.redirect=function(t,e){if(-1===fb.indexOf(e))throw new RangeError("Invalid status code");return new cb(null,{status:e,headers:{location:t}})};var lb=self.DOMException;try{new lb}catch(t){(lb=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack}).prototype=Object.create(Error.prototype),lb.prototype.constructor=lb}function hb(t,e){return new Promise(function(r,n){var o=new ub(t,e);if(o.signal&&o.signal.aborted)return n(new lb("Aborted","AbortError"));var i=new XMLHttpRequest;function a(){i.abort()}i.onload=function(){var t,e,n={status:i.status,statusText:i.statusText,headers:(t=i.getAllResponseHeaders()||"",e=new tb,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}}),e)};n.url="responseURL"in i?i.responseURL:n.headers.get("X-Request-URL"),r(new cb("response"in i?i.response:i.responseText,n))},i.onerror=function(){n(new TypeError("Network request failed"))},i.ontimeout=function(){n(new TypeError("Network request failed"))},i.onabort=function(){n(new lb("Aborted","AbortError"))},i.open(o.method,o.url,!0),"include"===o.credentials?i.withCredentials=!0:"omit"===o.credentials&&(i.withCredentials=!1),"responseType"in i&&Km&&(i.responseType="blob"),o.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),o.signal&&(o.signal.addEventListener("abort",a),i.onreadystatechange=function(){4===i.readyState&&o.signal.removeEventListener("abort",a)}),i.send(void 0===o._bodyInit?null:o._bodyInit)})}hb.polyfill=!0,self.fetch||(self.fetch=hb,self.Headers=tb,self.Request=ub,self.Response=cb);var pb=Object.getOwnPropertySymbols,vb=Object.prototype.hasOwnProperty,db=Object.prototype.propertyIsEnumerable,gb=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(e).map(function(t){return e[t]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(t){n[t]=t}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var r,n,o=function(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}(t),i=1;i<arguments.length;i++){for(var a in r=Object(arguments[i]))vb.call(r,a)&&(o[a]=r[a]);if(pb){n=pb(r);for(var u=0;u<n.length;u++)db.call(r,n[u])&&(o[n[u]]=r[n[u]])}}return o};Object.assign=gb}();

```

---
### 📄 `.next\static\chunks\webpack.js`

```javascript
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	!function() {
/******/ 		var getProto = Object.getPrototypeOf ? function(obj) { return Object.getPrototypeOf(obj); } : function(obj) { return obj.__proto__; };
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach(function(key) { def[key] = function() { return value[key]; }; });
/******/ 			}
/******/ 			def['default'] = function() { return value; };
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	!function() {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = function(chunkId) {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce(function(promises, key) {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/chunks/" + chunkId + ".js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/webpack/" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	!function() {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.miniCssF = function(chunkId) {
/******/ 			// return url for filenames based on template
/******/ 			return "static/css/" + chunkId + ".css";
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	!function() {
/******/ 		__webpack_require__.hmrF = function() { return "static/webpack/" + __webpack_require__.h() + ".webpack.hot-update.json"; };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	!function() {
/******/ 		__webpack_require__.h = function() { return "1aa851a74b488a29"; }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	!function() {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "_N_E:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = function(url, done, key, chunkId) {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = __webpack_require__.tu(url);
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = function(prev, event) {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach(function(fn) { return fn(event); });
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	!function() {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = function() {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: function(script) { return script; },
/******/ 					createScriptURL: function(url) { return url; }
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	!function() {
/******/ 		__webpack_require__.ts = function(script) { return __webpack_require__.tt().createScript(script); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script url */
/******/ 	!function() {
/******/ 		__webpack_require__.tu = function(url) { return __webpack_require__.tt().createScriptURL(url); };
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	!function() {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	!function() {
/******/ 		__webpack_require__.p = "/_next/";
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	!function() {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push(function(options) {
/******/ 			var originalFactory = options.factory;
/******/ 			options.factory = function(moduleObject, moduleExports, webpackRequire) {
/******/ 				var hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				var cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : function() {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	!function() {
/******/ 		var createStylesheet = function(chunkId, fullhref, resolve, reject) {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = function(event) {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = function(href, fullhref) {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = function(chunkId) {
/******/ 			return new Promise(function(resolve, reject) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// object to store loaded CSS chunks
/******/ 		var installedCssChunks = {
/******/ 			"webpack": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.miniCss = function(chunkId, promises) {
/******/ 			var cssChunks = {"_app-pages-browser_src_components_OpportunityMap_tsx":1};
/******/ 			if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
/******/ 			else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
/******/ 				promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(function() {
/******/ 					installedCssChunks[chunkId] = 0;
/******/ 				}, function(e) {
/******/ 					delete installedCssChunks[chunkId];
/******/ 					throw e;
/******/ 				}));
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var oldTags = [];
/******/ 		var newTags = [];
/******/ 		var applyHandler = function(options) {
/******/ 			return { dispose: function() {
/******/ 				for(var i = 0; i < oldTags.length; i++) {
/******/ 					var oldTag = oldTags[i];
/******/ 					if(oldTag.parentNode) oldTag.parentNode.removeChild(oldTag);
/******/ 				}
/******/ 				oldTags.length = 0;
/******/ 			}, apply: function() {
/******/ 				for(var i = 0; i < newTags.length; i++) newTags[i].rel = "stylesheet";
/******/ 				newTags.length = 0;
/******/ 			} };
/******/ 		}
/******/ 		__webpack_require__.hmrC.miniCss = function(chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			chunkIds.forEach(function(chunkId) {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				var oldTag = findStylesheet(href, fullhref);
/******/ 				if(!oldTag) return;
/******/ 				promises.push(new Promise(function(resolve, reject) {
/******/ 					var tag = createStylesheet(chunkId, fullhref, function() {
/******/ 						tag.as = "style";
/******/ 						tag.rel = "preload";
/******/ 						resolve();
/******/ 					}, reject);
/******/ 					oldTags.push(oldTag);
/******/ 					newTags.push(tag);
/******/ 				}));
/******/ 			});
/******/ 		}
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"webpack": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = function(chunkId, promises) {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("webpack" != chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise(function(resolve, reject) { installedChunkData = installedChunks[chunkId] = [resolve, reject]; });
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = function(event) {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise(function(resolve, reject) {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = function(event) {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdate_N_E"] = function(chunkId, moreModules, runtime) {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then(function(response) {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	
/******/ })()
;
```

---
### 📄 `.next\static\development\_buildManifest.js`

```javascript
self.__BUILD_MANIFEST = {__rewrites:{afterFiles:[],beforeFiles:[],fallback:[]},"/_error":["static\u002Fchunks\u002Fpages\u002F_error.js"],sortedPages:["\u002F_app","\u002F_error"]};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()
```

---
### 📄 `.next\static\development\_ssgManifest.js`

```javascript
self.__SSG_MANIFEST=new Set;self.__SSG_MANIFEST_CB&&self.__SSG_MANIFEST_CB()
```

---
### 📄 `.next\static\webpack\app\layout.31e6c162fd1dbcbe.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"699a6f6f96b6\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvZ2xvYmFscy5jc3M/NDc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjY5OWE2ZjZmOTZiNlwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ })

});
```

---
### 📄 `.next\static\webpack\app\layout.77015d6646824525.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"83dc65207fba\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvZ2xvYmFscy5jc3M/NDc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjgzZGM2NTIwN2ZiYVwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ })

});
```

---
### 📄 `.next\static\webpack\app\layout.c8d036faa06dd8d7.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"7758fcf444ff\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvZ2xvYmFscy5jc3M/NDc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjc3NThmY2Y0NDRmZlwiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ })

});
```

---
### 📄 `.next\static\webpack\app\layout.e4358b2fa5d326ba.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/app/globals.css":
/*!*****************************!*\
  !*** ./src/app/globals.css ***!
  \*****************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (\"19aebd77c02c\");\nif (true) { module.hot.accept() }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvZ2xvYmFscy5jc3MiLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlLGNBQWM7QUFDN0IsSUFBSSxJQUFVLElBQUksaUJBQWlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9hcHAvZ2xvYmFscy5jc3M/NDc4ZCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBcIjE5YWViZDc3YzAyY1wiXG5pZiAobW9kdWxlLmhvdCkgeyBtb2R1bGUuaG90LmFjY2VwdCgpIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/globals.css\n"));

/***/ })

});
```

---
### 📄 `.next\static\webpack\webpack.31e6c162fd1dbcbe.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("webpack",{},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "c8d036faa06dd8d7"; }
/******/ }();
/******/ 
/******/ }
);
```

---
### 📄 `.next\static\webpack\webpack.77015d6646824525.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("webpack",{},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "31e6c162fd1dbcbe"; }
/******/ }();
/******/ 
/******/ }
);
```

---
### 📄 `.next\static\webpack\webpack.c8d036faa06dd8d7.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("webpack",{},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "e4358b2fa5d326ba"; }
/******/ }();
/******/ 
/******/ }
);
```

---
### 📄 `.next\static\webpack\webpack.e4358b2fa5d326ba.hot-update.js`

```javascript
"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("webpack",{},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "1aa851a74b488a29"; }
/******/ }();
/******/ 
/******/ }
);
```

---
### 📄 `next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

```

---
### 📄 `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

```

---
### 📄 `prisma.config.ts`

```typescript
// This file was generated by Prisma, and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

```

---
### 📄 `src\app\api\properties\route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { properties, Property, calculateCapRate, calculateCashOnCashReturn, calculateMAO, calculateOnePercentRule, calculateGrossYield } from '@/data/properties';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const strategy = searchParams.get('strategy');
    const decision = searchParams.get('decision');
    const city = searchParams.get('city');

    // If single property ID is requested
    if (id) {
      const property = properties.find((p) => p.id === id);
      if (!property) {
        return NextResponse.json(
          { success: false, error: 'Property not found' },
          { status: 404 }
        );
      }
      
      // Add calculated fields
      const propertyWithCalculations = {
        ...property,
        pricePerSqft: Number((property.listPrice / property.sqft).toFixed(2)),
        pricePerDoor: Number((property.listPrice / property.bedrooms).toFixed(2)),
        capRate: Number(calculateCapRate(property).toFixed(2)),
        cashOnCashReturn: Number(calculateCashOnCashReturn(property).toFixed(2)),
        mao: Number(calculateMAO(property).toFixed(2)),
        onePercentRule: calculateOnePercentRule(property),
        grossYield: Number(calculateGrossYield(property).toFixed(2)),
      };

      return NextResponse.json({
        success: true,
        data: propertyWithCalculations,
      });
    }

    // Filter properties
    let filteredProperties = [...properties];

    if (search) {
      const lowerSearch = search.toLowerCase();
      filteredProperties = filteredProperties.filter(
        (p) =>
          p.address.toLowerCase().includes(lowerSearch) ||
          p.city.toLowerCase().includes(lowerSearch) ||
          p.rationale.toLowerCase().includes(lowerSearch) ||
          p.details.toLowerCase().includes(lowerSearch)
      );
    }

    if (strategy) {
      filteredProperties = filteredProperties.filter(
        (p) => p.strategy === strategy
      );
    }

    if (decision) {
      filteredProperties = filteredProperties.filter(
        (p) => p.decision === decision
      );
    }

    if (city) {
      filteredProperties = filteredProperties.filter(
        (p) => p.city.toLowerCase() === city.toLowerCase()
      );
    }

    // Add calculated fields to response
    const propertiesWithCalculations = filteredProperties.map((property) => ({
      ...property,
      pricePerSqft: Number((property.listPrice / property.sqft).toFixed(2)),
      pricePerDoor: Number((property.listPrice / property.bedrooms).toFixed(2)),
      capRate: Number(calculateCapRate(property).toFixed(2)),
      cashOnCashReturn: Number(calculateCashOnCashReturn(property).toFixed(2)),
      mao: Number(calculateMAO(property).toFixed(2)),
      onePercentRule: calculateOnePercentRule(property),
      grossYield: Number(calculateGrossYield(property).toFixed(2)),
    }));

    return NextResponse.json({
      success: true,
      data: propertiesWithCalculations,
      count: propertiesWithCalculations.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = await request.json();

    // Validate required fields
    const requiredFields = [
      'address', 'city', 'state', 'zip', 'lat', 'lng',
      'listPrice', 'equityGap', 'sqft', 'bedrooms', 'bathrooms',
      'decision', 'strategy', 'rationale', 'type', 'realtor', 'url', 'details'
    ];

    for (const field of requiredFields) {
      // @ts-ignore
      if (!propertyData[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      images: propertyData.images || [],
      estimatedRent: propertyData.estimatedRent || 0,
      annualTaxes: propertyData.annualTaxes || 0,
      annualInsurance: propertyData.annualInsurance || 0,
      renovationBudget: propertyData.renovationBudget || 0,
      afterRepairValue: propertyData.afterRepairValue || 0,
      notes: propertyData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real database, this would save to the database
    // For now, we'll just simulate it by updating the in-memory array
    properties.push(newProperty);

    return NextResponse.json({
      success: true,
      data: newProperty,
    }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const propertyData: Partial<Property> = await request.json();

    if (!propertyData.id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const propertyIndex = properties.findIndex((p) => p.id === propertyData.id);

    if (propertyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    const updatedProperty: Property = {
      ...properties[propertyIndex],
      ...propertyData,
      updatedAt: new Date().toISOString(),
    };

    // In a real database, this would update the database
    properties[propertyIndex] = updatedProperty;

    return NextResponse.json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const propertyIndex = properties.findIndex((p) => p.id === id);

    if (propertyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // In a real database, this would delete from the database
    properties.splice(propertyIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}

```

---
### 📄 `src\app\globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 15, 23, 42;
  --background-end-rgb: 2, 6, 23;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
  min-height: 100vh;
}

/* Leaflet Map Styles */
.leaflet-container {
  background-color: #1e293b;
  border-radius: 0.5rem;
}

.leaflet-tile-pane {
  filter: brightness(0.8) contrast(1.1) saturate(0.8);
}

.leaflet-popup-content-wrapper {
  background-color: #1e293b;
  color: #f8fafc;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.3);
}

.leaflet-popup-tip {
  background-color: #1e293b;
}

.leaflet-popup-content {
  margin: 0.75rem 1rem;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Table Styles */
.table-container {
  @apply overflow-auto rounded-lg border border-dark-700;
}

/* Kanban Column Styles */
.kanban-column {
  @apply bg-dark-800 rounded-lg p-4 min-h-[400px];
}

.kanban-card {
  @apply bg-dark-700 rounded-lg p-3 mb-3 border border-dark-600 hover:border-primary-500 transition-colors cursor-pointer;
}

/* Chart Styles */
.recharts-cartesian-grid-horizontal line,
.recharts-cartesian-grid-vertical line {
  stroke: #334155;
}

.recharts-text {
  fill: #94a3b8;
}

/* Animation Classes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Marker Pulse Animation */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.marker-pulse {
  animation: pulse 2s infinite;
}

/* Decision Badge Styles */
.decision-badge {
  @apply px-2 py-1 rounded-full text-xs font-semibold;
}

.decision-platinum {
  @apply bg-emerald-500/20 text-emerald-400 border border-emerald-500/30;
}

.decision-gold {
  @apply bg-amber-500/20 text-amber-400 border border-amber-500/30;
}

.decision-silver {
  @apply bg-orange-500/20 text-orange-400 border border-orange-500/30;
}

.decision-hardfail {
  @apply bg-red-500/20 text-red-400 border border-red-500/30;
}

.decision-caution {
  @apply bg-violet-500/20 text-violet-400 border border-violet-500/30;
}

/* Strategy Tag Styles */
.strategy-tag {
  @apply px-2 py-0.5 rounded text-xs font-medium;
}

.strategy-flip {
  @apply bg-blue-500/20 text-blue-400;
}

.strategy-section8 {
  @apply bg-green-500/20 text-green-400;
}

.strategy-brrr {
  @apply bg-purple-500/20 text-purple-400;
}

.strategy-ownerfinance {
  @apply bg-cyan-500/20 text-cyan-400;
}

.strategy-wholesaling {
  @apply bg-pink-500/20 text-pink-400;
}

```

---
### 📄 `src\app\layout.tsx`

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Real Estate Deal Triage Dashboard',
  description: 'High-performance real estate deal analysis and visualization dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-950 text-dark-50 antialiased">
        {children}
      </body>
    </html>
  )
}

```

---
### 📄 `src\app\lib\db.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---
### 📄 `src\app\page.tsx`

**⚠️ Analysis Findings:**
- 🔴 **[HIGH]** Button missing aria-label (Line 200)

```typescript
'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Sidebar, { ViewType } from '@/components/Sidebar';
import { properties as allProperties, searchProperties, Property } from '@/data/properties';
import ValueScatterPlot from '@/components/ValueScatterPlot';
import StrategyKanban from '@/components/StrategyKanban';
import PropertyDataTable from '@/components/PropertyDataTable';

// Dynamically import the map component to avoid SSR issues with Leaflet
const OpportunityMap = dynamic(() => import('@/components/OpportunityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-800 rounded-lg">
      <div className="animate-pulse text-dark-400">Loading map...</div>
    </div>
  ),
});

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties based on search query
  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return allProperties;
    return searchProperties(searchQuery);
  }, [searchQuery]);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const renderView = () => {
    switch (currentView) {
      case 'map':
        return (
          <OpportunityMap
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'scatter':
        return (
          <ValueScatterPlot
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'kanban':
        return (
          <StrategyKanban
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      case 'table':
        return (
          <PropertyDataTable
            properties={filteredProperties}
            onPropertyClick={handlePropertyClick}
          />
        );
      default:
        return null;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'map':
        return 'Geospatial Opportunity Map';
      case 'scatter':
        return 'Value Analysis Scatter Plot';
      case 'kanban':
        return 'Strategy Workflow Board';
      case 'table':
        return 'Interactive Data Grid';
      default:
        return '';
    }
  };

  const getViewDescription = () => {
    switch (currentView) {
      case 'map':
        return 'Color-coded markers indicate deal quality. Click markers for property details.';
      case 'scatter':
        return 'Identify value opportunities below the average price/sqft trend line.';
      case 'kanban':
        return 'Properties organized by investment strategy with equity gap analysis.';
      case 'table':
        return 'Sort, filter, and analyze properties with computed investment metrics.';
      default:
        return '';
    }
  };

  return (
    <div className="flex h-screen bg-dark-950">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{getViewTitle()}</h1>
              <p className="text-dark-400 mt-1">{getViewDescription()}</p>
            </div>
            <div className="flex items-center gap-4">
              {searchQuery && (
                <div className="bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-lg text-sm">
                  {filteredProperties.length} results for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
              <div className="text-sm text-dark-400">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="h-[calc(100vh-180px)]">
          {renderView()}
        </div>

        {/* Selected Property Detail Panel */}
        {selectedProperty && (
          <div className="fixed bottom-0 right-0 left-64 bg-dark-900 border-t border-dark-700 p-4 z-50 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedProperty.address}
                  </h3>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${getDecisionColor(selectedProperty.decision)}20`,
                      color: getDecisionColor(selectedProperty.decision),
                    }}
                  >
                    {selectedProperty.decision}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-4 text-sm">
                  <div>
                    <span className="text-dark-400">Price: </span>
                    <span className="text-emerald-400 font-medium">
                      ${selectedProperty.listPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-400">Equity Gap: </span>
                    <span className="text-amber-400 font-medium">
                      ${selectedProperty.equityGap.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-400">SqFt: </span>
                    <span>{selectedProperty.sqft.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Beds/Baths: </span>
                    <span>{selectedProperty.bedrooms} / {selectedProperty.bathrooms}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Strategy: </span>
                    <span className="text-primary-400">{selectedProperty.strategy}</span>
                  </div>
                  <div>
                    <span className="text-dark-400">Type: </span>
                    <span>{selectedProperty.type}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-dark-300">
                  {selectedProperty.rationale}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <a
                  href={selectedProperty.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  View on Zillow
                </a>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper function to get decision color (imported from data module)
function getDecisionColor(decision: string): string {
  const colors: Record<string, string> = {
    'Pass Platinum': '#10b981',
    'Pass Gold': '#f59e0b',
    'Pass Silver': '#f97316',
    'Hard Fail': '#ef4444',
    'Caution': '#8b5cf6',
  };
  return colors[decision] || '#64748b';
}

```

---
### 📄 `src\app\properties\[id]\page.tsx`

**⚠️ Analysis Findings:**
- 🔵 **[MEDIUM]** Image missing alt text (Line 135)

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Property, 
  getPricePerSqft, 
  getPricePerDoor, 
  getDecisionColor, 
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateMAO,
  calculateOnePercentRule,
  calculateGrossYield
} from '@/data/properties';

interface PropertyPageProps {
  params: { id: string };
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/properties?id=${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.status}`);
      }

      const data = await response.json();
      setProperty(data.data);
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading property...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-dark-400 mb-6">{error || 'The property you are looking for does not exist.'}</p>
        <Link 
          href="/"
          className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors mb-6"
          >
            <span className="text-lg">←</span>
            Return to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${getDecisionColor(property.decision)}20`,
                    color: getDecisionColor(property.decision),
                  }}
                >
                  {property.decision}
                </span>
                <span className="px-3 py-1 bg-dark-800 text-white rounded-full text-xs font-semibold">
                  {property.strategy}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{property.address}</h1>
              <p className="text-xl text-dark-400">
                {property.city}, {property.state} {property.zip}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={property.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View on Zillow
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Property Details</h2>
              
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-48 bg-dark-700 rounded-lg flex items-center justify-center mb-6">
                  <p className="text-dark-400">No images available</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-dark-400 mb-1">List Price</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    ${property.listPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Square Feet</p>
                  <p className="text-lg font-semibold text-white">
                    {property.sqft.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Bedrooms</p>
                  <p className="text-lg font-semibold text-white">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Bathrooms</p>
                  <p className="text-lg font-semibold text-white">{property.bathrooms}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-dark-400 mb-2">Type</p>
                <p className="text-white">{property.type}</p>
              </div>

              {property.details && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Details</p>
                  <p className="text-white">{property.details}</p>
                </div>
              )}

              {property.realtor && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Realtor</p>
                  <p className="text-white">{property.realtor}</p>
                </div>
              )}

              {property.notes && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Notes</p>
                  <p className="text-white">{property.notes}</p>
                </div>
              )}
            </div>

            {/* Rationale */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Investment Rationale</h2>
              <p className="text-dark-300">{property.rationale}</p>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Financial Analysis</h2>

              {/* Price Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Price per SqFt</p>
                    <p className="text-sm font-semibold text-white">
                      ${getPricePerSqft(property).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Price per Door</p>
                    <p className="text-sm font-semibold text-white">
                      ${getPricePerDoor(property).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Equity Gap</p>
                    <p className="text-sm font-semibold text-amber-400">
                      ${property.equityGap.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-dark-700" />

              {/* Investment Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Cap Rate</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateCapRate(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Cash-on-Cash Return</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateCashOnCashReturn(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Gross Yield</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateGrossYield(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">1% Rule</p>
                    <p className={`text-sm font-semibold ${
                      calculateOnePercentRule(property) ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {calculateOnePercentRule(property) ? 'Pass' : 'Fail'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">MAO</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      ${calculateMAO(property).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-dark-700" />

              {/* Expense Estimates */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Estimated Rent</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.estimatedRent.toLocaleString()}/mo
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Annual Taxes</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.annualTaxes.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Annual Insurance</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.annualInsurance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Renovation Budget</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.renovationBudget.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">ARV</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.afterRepairValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-dark-800 rounded-lg border border-dark-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-dark-400 mb-1">Created At</p>
              <p className="text-white">{new Date(property.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Last Updated</p>
              <p className="text-white">{new Date(property.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Property ID</p>
              <p className="text-white font-mono">{property.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---
### 📄 `src\components\DashboardClient.tsx`

```typescript

```

---
### 📄 `src\components\OpportunityMap.tsx`

**⚠️ Analysis Findings:**
- 🔴 **[HIGH]** Button missing aria-label (Line 97)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property, getDecisionColor, Decision } from '@/data/properties';

// Fix for default marker icons in Next.js
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to fit bounds to markers
function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [properties, map]);
  
  return null;
}

interface OpportunityMapProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

export default function OpportunityMap({ properties, onPropertyClick }: OpportunityMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | 'all'>('all');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-800 rounded-lg">
        <div className="animate-pulse text-dark-400">Loading map...</div>
      </div>
    );
  }

  const filteredProperties = selectedDecision === 'all' 
    ? properties 
    : properties.filter(p => p.decision === selectedDecision);

  const defaultCenter: [number, number] = [32.5, -94.8];
  const defaultZoom = 9;

  const decisionFilters: { value: Decision | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: '#64748b' },
    { value: 'Pass Platinum', label: 'Platinum', color: '#10b981' },
    { value: 'Pass Gold', label: 'Gold', color: '#f59e0b' },
    { value: 'Pass Silver', label: 'Silver', color: '#f97316' },
    { value: 'Hard Fail', label: 'Hard Fail', color: '#ef4444' },
    { value: 'Caution', label: 'Caution', color: '#8b5cf6' },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Filter Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-dark-800/95 backdrop-blur-sm rounded-lg p-3 border border-dark-600">
        <div className="text-xs font-semibold text-dark-300 mb-2">Filter by Decision</div>
        <div className="flex flex-wrap gap-2">
          {decisionFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedDecision(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDecision === filter.value
                  ? 'ring-2 ring-offset-2 ring-offset-dark-800'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: `${filter.color}20`,
                color: filter.color,
                '--tw-ring-color': filter.color,
              } as React.CSSProperties}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-dark-800/95 backdrop-blur-sm rounded-lg p-3 border border-dark-600">
        <div className="text-xs font-semibold text-dark-300 mb-2">Decision Legend</div>
        <div className="space-y-1.5">
          {decisionFilters.slice(1).map((filter) => (
            <div key={filter.value} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: filter.color }}
              />
              <span className="text-xs text-dark-300">{filter.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="w-full h-full rounded-lg"
        style={{ background: '#1e293b' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds properties={filteredProperties} />
        
        {filteredProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={createMarkerIcon(getDecisionColor(property.decision))}
            eventHandlers={{
              click: () => onPropertyClick?.(property),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="font-semibold text-white mb-2">{property.address}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Price:</span>
                    <span className="text-emerald-400 font-medium">
                      ${property.listPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Decision:</span>
                    <span 
                      className="font-medium"
                      style={{ color: getDecisionColor(property.decision) }}
                    >
                      {property.decision}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Strategy:</span>
                    <span className="text-primary-400">{property.strategy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Equity Gap:</span>
                    <span className="text-amber-400">
                      ${property.equityGap.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">SqFt:</span>
                    <span>{property.sqft.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Beds/Baths:</span>
                    <span>{property.bedrooms} / {property.bathrooms}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-dark-600">
                  <div className="text-xs text-dark-400 line-clamp-2">
                    {property.rationale}
                  </div>
                </div>
                <a
                  href={property.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center text-xs text-primary-400 hover:text-primary-300"
                >
                  View on Zillow →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

```

---
### 📄 `src\components\PropertyDataTable.tsx`

**⚠️ Analysis Findings:**
- 🔴 **[HIGH]** Button missing aria-label (Line 325)
- 🔴 **[HIGH]** Button missing aria-label (Line 335)

```typescript
'use client';

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { 
  Property, 
  getPricePerSqft, 
  getPricePerDoor, 
  getDecisionColor, 
  Decision,
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateMAO,
  calculateOnePercentRule,
  calculateGrossYield
} from '@/data/properties';

interface PropertyDataTableProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const columnHelper = createColumnHelper<Property>();

export default function PropertyDataTable({ properties, onPropertyClick }: PropertyDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [estimatedRent, setEstimatedRent] = useState<Record<string, number>>({});

  const columns = useMemo(
    () => [
      columnHelper.accessor('address', {
        header: 'Address',
        cell: (info) => (
          <div>
            <div className="font-medium text-white">{info.getValue()}</div>
            <div className="text-xs text-dark-400">{info.row.original.city}</div>
          </div>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('listPrice', {
        header: 'List Price',
        cell: (info) => (
          <span className="text-emerald-400 font-medium">
            ${info.getValue().toLocaleString()}
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('sqft', {
        header: 'SqFt',
        cell: (info) => info.getValue()?.toLocaleString() || 'N/A',
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => getPricePerSqft(row), {
        id: 'pricePerSqft',
        header: '$/SqFt',
        cell: (info) => {
          const value = info.getValue();
          const avgPricePerSqft = properties.reduce((sum, p) => sum + getPricePerSqft(p), 0) / properties.length;
          const isBelowAverage = value < avgPricePerSqft;
          return (
            <span className={clsx(isBelowAverage && 'text-emerald-400 font-medium')}>
              ${value.toFixed(2)}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('bedrooms', {
        header: 'Beds',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => getPricePerDoor(row), {
        id: 'pricePerDoor',
        header: '$/Door',
        cell: (info) => (
          <span className="text-primary-400">
            ${info.getValue().toLocaleString()}
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('decision', {
        header: 'Decision',
        cell: (info) => {
          const decision = info.getValue();
          return (
            <span
              className="px-2 py-1 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${getDecisionColor(decision)}20`,
                color: getDecisionColor(decision),
              }}
            >
              {decision}
            </span>
          );
        },
        footer: (props) => props.column.id,
        filterFn: (row, columnId, filterValue) => {
          const decision = row.getValue(columnId) as Decision;
          if (filterValue === 'all') return true;
          return decision === filterValue;
        },
      }),
      columnHelper.accessor('strategy', {
        header: 'Strategy',
        cell: (info) => {
          const strategy = info.getValue();
          const colors: Record<string, string> = {
            'Retail Flip': '#3b82f6',
            'Section 8': '#22c55e',
            'BRRR': '#a855f7',
            'Owner Finance': '#06b6d4',
            'Wholesaling': '#ec4899',
          };
          return (
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${colors[strategy]}20`,
                color: colors[strategy],
              }}
            >
              {strategy}
            </span>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('equityGap', {
        header: 'Equity Gap',
        cell: (info) => (
          <span className="text-amber-400 font-medium">
            ${info.getValue().toLocaleString()}
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => calculateCapRate(row), {
        id: 'capRate',
        header: 'Cap Rate',
        cell: (info) => (
          <span className={clsx(
            'text-sm font-medium',
            info.getValue() >= 8 ? 'text-emerald-400' : 
            info.getValue() >= 6 ? 'text-amber-400' : 'text-red-400'
          )}>
            {info.getValue().toFixed(2)}%
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => calculateCashOnCashReturn(row), {
        id: 'cashOnCash',
        header: 'Cash-on-Cash',
        cell: (info) => (
          <span className={clsx(
            'text-sm font-medium',
            info.getValue() >= 15 ? 'text-emerald-400' : 
            info.getValue() >= 10 ? 'text-amber-400' : 'text-red-400'
          )}>
            {info.getValue().toFixed(2)}%
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => calculateMAO(row), {
        id: 'mao',
        header: 'MAO',
        cell: (info) => (
          <span className="text-emerald-400 font-medium">
            ${info.getValue().toLocaleString()}
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => calculateGrossYield(row), {
        id: 'grossYield',
        header: 'Gross Yield',
        cell: (info) => (
          <span className={clsx(
            'text-sm font-medium',
            info.getValue() >= 12 ? 'text-emerald-400' : 
            info.getValue() >= 8 ? 'text-amber-400' : 'text-red-400'
          )}>
            {info.getValue().toFixed(2)}%
          </span>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => {
        const rent = estimatedRent[row.id] || row.estimatedRent || 0;
        const price = row.listPrice;
        if (rent <= 0) return { passes: false, ratio: 0, rent };
        const ratio = (rent / price) * 100;
        return { passes: ratio >= 1, ratio, rent };
      }, {
        id: 'onePercentRule',
        header: '1% Rule',
        cell: (info) => {
          const { passes, ratio, rent } = info.getValue();
          const propertyId = info.row.original.id;
          
          return (
            <div className="flex flex-col gap-1">
              <input
                type="number"
                placeholder="Est. Rent"
                value={rent || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setEstimatedRent((prev) => ({
                    ...prev,
                    [propertyId]: value,
                  }));
                }}
                className="w-20 px-2 py-1 text-xs bg-dark-700 border border-dark-600 rounded focus:outline-none focus:border-primary-500"
                onClick={(e) => e.stopPropagation()}
              />
              {rent > 0 && (
                <span
                  className={clsx(
                    'text-xs font-medium',
                    passes ? 'text-emerald-400' : 'text-red-400'
                  )}
                >
                  {ratio.toFixed(2)}% {passes ? '✓' : '✗'}
                </span>
              )}
            </div>
          );
        },
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor('rationale', {
        header: 'Rationale',
        cell: (info) => (
          <div className="max-w-xs truncate text-xs text-dark-300" title={info.getValue()}>
            {info.getValue()}
          </div>
        ),
        footer: (props) => props.column.id,
      }),
    ],
    [properties, estimatedRent]
  );

  const table = useReactTable({
    data: properties,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const decisionFilterOptions: { value: Decision | 'all'; label: string }[] = [
    { value: 'all', label: 'All Decisions' },
    { value: 'Pass Platinum', label: 'Platinum' },
    { value: 'Pass Gold', label: 'Gold' },
    { value: 'Pass Silver', label: 'Silver' },
    { value: 'Hard Fail', label: 'Hard Fail' },
    { value: 'Caution', label: 'Caution' },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter as string}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-64 px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Decision Filter */}
          <select
            value={(columnFilters.find((f) => f.id === 'decision')?.value as string) || 'all'}
            onChange={(e) => {
              const value = e.target.value;
              table.getColumn('decision')?.setFilterValue(value);
            }}
            className="px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          >
            {decisionFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-dark-300">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 bg-dark-700 border border-dark-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-dark-800 rounded-lg border border-dark-700">
        <table className="w-full">
          <thead className="bg-dark-900 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx(
                      'px-4 py-3 text-left text-xs font-semibold text-dark-300 uppercase tracking-wider cursor-pointer hover:bg-dark-700 transition-colors',
                      header.column.getIsSorted() && 'text-primary-400'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() && (
                        <span>
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-dark-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onPropertyClick?.(row.original)}
                className="hover:bg-dark-700/50 cursor-pointer transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            No properties found matching your criteria
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-dark-400">
        <div>
          Showing {table.getRowModel().rows.length} of {properties.length} properties
        </div>
        <div className="flex items-center gap-4">
          <span>
            Total Equity Gap:{' '}
            <span className="text-amber-400 font-medium">
              ${properties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

```

---
### 📄 `src\components\Sidebar.tsx`

**⚠️ Analysis Findings:**
- 🔴 **[HIGH]** Button missing aria-label (Line 53)
- 🔴 **[HIGH]** Button missing aria-label (Line 95)

```typescript
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import {
  MapIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export type ViewType = 'map' | 'scatter' | 'kanban' | 'table';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const navigationItems = [
  { id: 'map' as ViewType, name: 'Opportunity Map', icon: MapIcon },
  { id: 'scatter' as ViewType, name: 'Value Analysis', icon: ChartBarIcon },
  { id: 'kanban' as ViewType, name: 'Strategy Board', icon: Squares2X2Icon },
  { id: 'table' as ViewType, name: 'Data Grid', icon: TableCellsIcon },
];

export default function Sidebar({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-full bg-dark-900 border-r border-dark-700 transition-all duration-300 z-50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-dark-700">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-primary-500" />
            <span className="font-semibold text-lg">Deal Triage</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={clsx('w-5 h-5 transition-transform', isCollapsed && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-dark-700">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search rationale..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            />
          </div>
          <p className="mt-2 text-xs text-dark-400">
            Try: &ldquo;Foreclosure&rdquo;, &ldquo;Rent Ready&rdquo;, &ldquo;Price cut&rdquo;
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-2 mt-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1',
                isActive
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Stats Section */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-xl font-bold text-primary-400">25</div>
              <div className="text-xs text-dark-400">Properties</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-xl font-bold text-emerald-400">8</div>
              <div className="text-xs text-dark-400">Platinum</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

```

---
### 📄 `src\components\StrategyKanban.tsx`

```typescript
'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Property, Strategy, getDecisionColor, getPricePerSqft } from '@/data/properties';

interface StrategyKanbanProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const strategyConfig: { strategy: Strategy; label: string; color: string; icon: string }[] = [
  { strategy: 'Retail Flip', label: 'Retail Flip', color: '#3b82f6', icon: '🏠' },
  { strategy: 'Section 8', label: 'Section 8', color: '#22c55e', icon: '🏘️' },
  { strategy: 'BRRR', label: 'BRRR', color: '#a855f7', icon: '🔄' },
  { strategy: 'Owner Finance', label: 'Owner Finance', color: '#06b6d4', icon: '💰' },
  { strategy: 'Wholesaling', label: 'Wholesaling', color: '#ec4899', icon: '🤝' },
];

// Sortable Card Component
interface SortableCardProps {
  property: Property;
  isDragging?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const SortableCard = ({ property, isDragging, selected, onSelect }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dndDragging,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || dndDragging ? 0.5 : 1,
    zIndex: isDragging || dndDragging ? 999 : 'auto',
  };

  const getDecisionBadgeClass = (decision: Property['decision']) => {
    switch (decision) {
      case 'Pass Platinum':
        return 'decision-platinum';
      case 'Pass Gold':
        return 'decision-gold';
      case 'Pass Silver':
        return 'decision-silver';
      case 'Hard Fail':
        return 'decision-hardfail';
      case 'Caution':
        return 'decision-caution';
      default:
        return '';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={clsx(
        'kanban-card bg-dark-800 border border-dark-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all',
        selected && 'ring-2 ring-primary-500'
      )}
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {property.address}
          </div>
          <div className="text-xs text-dark-400">
            {property.city}, {property.state}
          </div>
        </div>
        <span className={clsx('decision-badge ml-2', getDecisionBadgeClass(property.decision))}>
          {property.decision.split(' ')[1] || property.decision}
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <span className="text-dark-400">Price: </span>
          <span className="text-emerald-400 font-medium">
            ${property.listPrice.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-dark-400">Equity: </span>
          <span className="text-amber-400 font-medium">
            ${property.equityGap.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-dark-400">SqFt: </span>
          <span>{property.sqft.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-dark-400">$/SqFt: </span>
          <span className="text-primary-400">
            ${getPricePerSqft(property).toFixed(0)}
          </span>
        </div>
      </div>

      {/* Beds/Baths */}
      <div className="flex items-center gap-3 text-xs text-dark-400">
        <span>🛏️ {property.bedrooms}</span>
        <span>🚿 {property.bathrooms}</span>
      </div>

      {/* Expanded Details */}
      {selected && (
        <div className="mt-3 pt-3 border-t border-dark-600 animate-fade-in">
          <div className="text-xs text-dark-300 mb-2">
            {property.rationale}
          </div>
          <a
            href={property.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary-400 hover:text-primary-300"
            onClick={(e) => e.stopPropagation()}
          >
            View on Zillow →
          </a>
        </div>
      )}
    </div>
  );
};

export default function StrategyKanban({ properties, onPropertyClick }: StrategyKanbanProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [groupedProperties, setGroupedProperties] = useState<Record<Strategy, Property[]>>(() => {
    const groups: Record<Strategy, Property[]> = {
      'Retail Flip': [],
      'Section 8': [],
      'BRRR': [],
      'Owner Finance': [],
      'Wholesaling': [],
    };

    properties.forEach((property) => {
      groups[property.strategy].push(property);
    });

    return groups;
  });

  // Initialize sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Find source and destination columns
    let sourceColumn: Strategy | null = null;
    let destColumn: Strategy | null = null;

    Object.entries(groupedProperties).forEach(([strategy, props]) => {
      if (props.some((p) => p.id === active.id)) {
        sourceColumn = strategy as Strategy;
      }
      if (over.id.toString().startsWith('column-')) {
        destColumn = over.id.toString().replace('column-', '') as Strategy;
      } else if (props.some((p) => p.id === over.id)) {
        // If dropped on a card, find the column
        destColumn = strategy as Strategy;
      }
    });

    if (!sourceColumn) {
      setActiveId(null);
      return;
    }

    if (sourceColumn === destColumn) {
      // Reorder within the same column
      const sourceItems = [...groupedProperties[sourceColumn]] as Property[];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);
      const overId = over.id as string;
      const overIndex = sourceItems.findIndex((p) => p.id === overId);

      if (activeIndex !== overIndex) {
        const reordered = arrayMove(sourceItems, activeIndex, overIndex);
        setGroupedProperties((prev) => ({
          ...prev,
          [sourceColumn as string]: reordered,
        }));
      }
    } else if (destColumn) {
      // Move to different column
      const sourceItems = [...groupedProperties[sourceColumn]] as Property[];
      const destItems = [...groupedProperties[destColumn]] as Property[];
      const activeIndex = sourceItems.findIndex((p) => p.id === active.id);

      if (activeIndex !== -1) {
        const [movedProperty] = sourceItems.splice(activeIndex, 1);
        const updatedProperty = {
          ...movedProperty,
          strategy: destColumn,
        };

        // Find the position to insert
        if (over.id.toString().startsWith('column-')) {
          destItems.push(updatedProperty);
        } else {
          const overIndex = destItems.findIndex((p) => p.id === over.id);
          destItems.splice(overIndex + 1, 0, updatedProperty);
        }

        setGroupedProperties((prev) => ({
          ...prev,
          [sourceColumn as string]: sourceItems,
          [destColumn as string]: destItems,
        }));
      }
    }

    setActiveId(null);
  };

  const totalEquityGap = useMemo(() => {
    return Object.values(groupedProperties).flat().reduce((sum, p) => sum + p.equityGap, 0);
  }, [groupedProperties]);

  const activeProperty = useMemo(() => {
    return activeId ? Object.values(groupedProperties)
      .flat()
      .find((p) => p.id === activeId) : null;
  }, [activeId, groupedProperties]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full flex flex-col">
        {/* Header Stats */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {strategyConfig.map(({ strategy, label, color, icon }) => {
            const props = groupedProperties[strategy];
            const totalEquity = props.reduce((sum, p) => sum + p.equityGap, 0);
            
            return (
              <div
                key={strategy}
                className="bg-dark-800 rounded-lg p-3 border border-dark-700"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{icon}</span>
                  <span className="text-xs font-medium text-dark-300">{label}</span>
                </div>
                <div className="text-lg font-bold text-white">{props.length}</div>
                <div className="text-xs text-emerald-400">
                  ${totalEquity.toLocaleString()} equity
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Equity Summary */}
        <div className="bg-gradient-to-r from-primary-500/20 to-emerald-500/20 rounded-lg p-4 mb-4 border border-primary-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-dark-300">Total Portfolio Equity Gap</div>
              <div className="text-2xl font-bold text-white">
                ${totalEquityGap.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-dark-300">Properties Analyzed</div>
              <div className="text-2xl font-bold text-primary-400">
                {Object.values(groupedProperties).flat().length}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 min-w-max h-full">
            {strategyConfig.map(({ strategy, label, color, icon }) => {
              const columnProperties = groupedProperties[strategy];
              
              return (
                <div
                  key={strategy}
                  className="kanban-column flex-shrink-0 w-72"
                  style={{ borderTopColor: color, borderTopWidth: 3 }}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <span className="font-semibold text-white">{label}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${color}30`, color }}
                    >
                      {columnProperties.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div
                    id={`column-${strategy}`}
                    className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1"
                  >
                    <SortableContext
                      items={columnProperties.map((p) => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      {columnProperties.length === 0 ? (
                        <div className="text-center py-8 text-dark-500 text-sm">
                          No properties
                        </div>
                      ) : (
                        columnProperties.map((property) => (
                          <SortableCard
                            key={property.id}
                            property={property}
                            isDragging={activeId === property.id}
                            selected={selectedProperty === property.id}
                            onSelect={() => {
                              setSelectedProperty(
                                selectedProperty === property.id ? null : property.id
                              );
                              onPropertyClick?.(property);
                            }}
                          />
                        ))
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeProperty ? (
          <SortableCard
            property={activeProperty}
            isDragging={true}
            selected={selectedProperty === activeProperty.id}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

```

---
### 📄 `src\components\ValueScatterPlot.tsx`

**⚠️ Analysis Findings:**
- 🔴 **[HIGH]** Button missing aria-label (Line 128)

```typescript
'use client';

import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Property, getPricePerSqft, getDecisionColor, getAveragePricePerSqft, Decision } from '@/data/properties';

interface ValueScatterPlotProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

interface ChartData {
  x: number;
  y: number;
  size: number;
  property: Property;
  isOutlier: boolean;
}

export default function ValueScatterPlot({ properties, onPropertyClick }: ValueScatterPlotProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | 'all'>('all');
  const [showTrendLine, setShowTrendLine] = useState(true);

  const averagePricePerSqft = useMemo(() => {
    const validProperties = properties.filter(p => p.sqft > 0);
    if (validProperties.length === 0) return 0;
    const total = validProperties.reduce((sum, p) => sum + getPricePerSqft(p), 0);
    return total / validProperties.length;
  }, [properties]);

  const chartData: ChartData[] = useMemo(() => {
    const maxPrice = Math.max(...properties.map(p => p.listPrice));
    const minSize = 100;
    const maxSize = 1000;

    return properties
      .filter(p => p.sqft > 0)
      .filter(p => selectedDecision === 'all' || p.decision === selectedDecision)
      .map(p => {
        const pricePerSqft = getPricePerSqft(p);
        const normalizedSize = minSize + ((p.listPrice / maxPrice) * (maxSize - minSize));
        return {
          x: p.sqft,
          y: pricePerSqft,
          size: normalizedSize,
          property: p,
          isOutlier: pricePerSqft < averagePricePerSqft * 0.7,
        };
      });
  }, [properties, selectedDecision, averagePricePerSqft]);

  const outlierCount = chartData.filter(d => d.isOutlier).length;

  const decisionFilters: { value: Decision | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All', color: '#64748b' },
    { value: 'Pass Platinum', label: 'Platinum', color: '#10b981' },
    { value: 'Pass Gold', label: 'Gold', color: '#f59e0b' },
    { value: 'Pass Silver', label: 'Silver', color: '#f97316' },
    { value: 'Hard Fail', label: 'Hard Fail', color: '#ef4444' },
    { value: 'Caution', label: 'Caution', color: '#8b5cf6' },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const { property } = data;
      
      return (
        <div className="bg-dark-800 border border-dark-600 rounded-lg p-3 shadow-xl max-w-xs">
          <div className="font-semibold text-white mb-2">{property.address}</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">List Price:</span>
              <span className="text-emerald-400 font-medium">
                ${property.listPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">SqFt:</span>
              <span>{property.sqft.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">$/SqFt:</span>
              <span className={data.isOutlier ? 'text-emerald-400 font-bold' : ''}>
                ${getPricePerSqft(property).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">Decision:</span>
              <span style={{ color: getDecisionColor(property.decision) }}>
                {property.decision}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-dark-400">Strategy:</span>
              <span className="text-primary-400">{property.strategy}</span>
            </div>
          </div>
          {data.isOutlier && (
            <div className="mt-2 pt-2 border-t border-dark-600">
              <span className="text-xs text-emerald-400 font-medium">
                ⭐ Below Average - Potential Value!
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {decisionFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedDecision(filter.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedDecision === filter.value
                  ? 'ring-2 ring-offset-2 ring-offset-dark-800'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{ 
                backgroundColor: `${filter.color}20`,
                color: filter.color,
                '--tw-ring-color': filter.color,
              } as React.CSSProperties}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-dark-300">
            <input
              type="checkbox"
              checked={showTrendLine}
              onChange={(e) => setShowTrendLine(e.target.checked)}
              className="rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-primary-500"
            />
            Show Average Line
          </label>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Average $/SqFt</div>
          <div className="text-xl font-bold text-primary-400">
            ${averagePricePerSqft.toFixed(2)}
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Properties Shown</div>
          <div className="text-xl font-bold text-white">{chartData.length}</div>
        </div>
        <div className="bg-dark-800 rounded-lg p-3 border border-dark-700">
          <div className="text-xs text-dark-400 mb-1">Value Outliers</div>
          <div className="text-xl font-bold text-emerald-400">{outlierCount}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[400px] bg-dark-800 rounded-lg border border-dark-700 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              type="number"
              dataKey="x"
              name="Square Footage"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{ 
                value: 'Square Footage', 
                position: 'bottom',
                fill: '#94a3b8',
                fontSize: 12,
                offset: 40,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Price per SqFt"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              tickLine={{ stroke: '#475569' }}
              label={{ 
                value: 'Price per SqFt ($)', 
                angle: -90,
                position: 'left',
                fill: '#94a3b8',
                fontSize: 12,
                offset: 40,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {showTrendLine && (
              <ReferenceLine
                y={averagePricePerSqft}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: $${averagePricePerSqft.toFixed(0)}/sqft`,
                  position: 'right',
                  fill: '#f59e0b',
                  fontSize: 11,
                }}
              />
            )}
            
            <Scatter
              name="Properties"
              data={chartData}
              onClick={(data) => onPropertyClick?.(data.property)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getDecisionColor(entry.property.decision)}
                  stroke={entry.isOutlier ? '#10b981' : 'transparent'}
                  strokeWidth={entry.isOutlier ? 2 : 0}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-dark-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-dark-400" />
          <span>Bubble size = List Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500" />
          <span>Green border = Below average (value opportunity)</span>
        </div>
      </div>
    </div>
  );
}

```

---
### 📄 `src\data\properties.ts`

```typescript
export type Decision = 'Pass Platinum' | 'Pass Gold' | 'Pass Silver' | 'Hard Fail' | 'Caution';
export type Strategy = 'Retail Flip' | 'Section 8' | 'BRRR' | 'Owner Finance' | 'Wholesaling';

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  listPrice: number;
  equityGap: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  decision: Decision;
  strategy: Strategy;
  rationale: string;
  type: string;
  realtor: string;
  url: string;
  details: string;
  // New fields for enhanced functionality
  images: string[];
  estimatedRent: number;
  annualTaxes: number;
  annualInsurance: number;
  renovationBudget: number;
  afterRepairValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Approximate lat/lng coordinates for East Texas cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  'Longview': { lat: 32.5007, lng: -94.7405 },
  'Marshall': { lat: 32.5449, lng: -94.3674 },
  'Kilgore': { lat: 32.3863, lng: -94.8756 },
  'Tyler': { lat: 32.3513, lng: -95.3011 },
  'Gilmer': { lat: 32.7288, lng: -94.9424 },
  'Athens': { lat: 32.2049, lng: -95.8550 },
  'Quitman': { lat: 32.8479, lng: -95.4458 },
  'Henderson': { lat: 32.1532, lng: -94.7997 },
  'Jacksonville': { lat: 31.9635, lng: -95.2705 },
  'Mineola': { lat: 32.6626, lng: -95.4891 },
  'Tatum': { lat: 32.5868, lng: -94.5199 },
  'Hawkins': { lat: 32.5885, lng: -95.2044 },
  'Bullard': { lat: 32.1388, lng: -95.3219 },
  'Whitehouse': { lat: 32.2207, lng: -95.2219 },
  'Flint': { lat: 32.2040, lng: -95.3491 },
  'Lindale': { lat: 32.5157, lng: -95.4094 },
  'Rusk': { lat: 31.7957, lng: -95.1505 },
  'Overton': { lat: 32.2757, lng: -94.9427 },
  'Arp': { lat: 32.2274, lng: -95.0544 },
  'Chandler': { lat: 32.3032, lng: -95.4794 },
  'Frankston': { lat: 32.0524, lng: -95.5058 },
  'Avinger': { lat: 32.5457, lng: -94.5488 },
  'Laneville': { lat: 32.2346, lng: -94.8852 },
  'Ore City': { lat: 32.7999, lng: -94.7216 },
  'Big Sandy': { lat: 32.5818, lng: -95.0769 },
  'Winona': { lat: 32.3299, lng: -95.1172 },
  'Diana': { lat: 32.7010, lng: -94.7155 },
  'Brownsboro': { lat: 32.3018, lng: -95.6133 },
  'Mount Enterprise': { lat: 31.9310, lng: -94.6841 },
  'Troup': { lat: 32.1507, lng: -95.1227 },
};

// Helper to add small random offset for map visibility
const addOffset = (coord: number, offset: number = 0.01): number => {
  return coord + (Math.random() - 0.5) * offset;
};

// Default values for new Property fields
const defaultProps = {
  images: [] as string[],
  estimatedRent: 0,
  annualTaxes: 0,
  annualInsurance: 0,
  renovationBudget: 0,
  afterRepairValue: 0,
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const properties: Property[] = [
  {
    id: '1',
    address: '1401 Gay St',
    city: 'Longview',
    state: 'TX',
    zip: '75602',
    lat: addOffset(cityCoordinates['Longview'].lat),
    lng: addOffset(cityCoordinates['Longview'].lng),
    listPrice: 45000,
    equityGap: 25000,
    sqft: 2418,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'BRRR',
    rationale: 'Excellent price per sqft at $18.60. Large home with great rental potential. Foreclosure opportunity with significant equity potential.',
    type: 'House for sale',
    realtor: 'TEXAS REAL ESTATE EXECUTIVES, THE DANIELS GROUP - GILMER',
    url: 'https://www.zillow.com/homedetails/1401-Gay-St-Longview-TX-75602/50774946_zpid/',
    details: '305 days on Zillow',
    ...defaultProps,
    estimatedRent: 1200,
    annualTaxes: 1800,
    annualInsurance: 1200,
    afterRepairValue: 95000,
    renovationBudget: 25000,
  },
  {
    id: '2',
    address: '1510 Ray St',
    city: 'Longview',
    state: 'TX',
    zip: '75602',
    lat: addOffset(cityCoordinates['Longview'].lat),
    lng: addOffset(cityCoordinates['Longview'].lng),
    listPrice: 45000,
    equityGap: 18000,
    sqft: 1754,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Gold',
    strategy: 'Retail Flip',
    rationale: 'Recent price cut of $15,000 indicates motivated seller. Good flip potential in established neighborhood.',
    type: 'House for sale',
    realtor: 'JOSEPH WALTER REALTY, LLC',
    url: 'https://www.zillow.com/homedetails/1510-Ray-St-Longview-TX-75602/50793123_zpid/',
    details: 'Price cut: $15,000 (2/3)',
    ...defaultProps,
    estimatedRent: 1100,
    afterRepairValue: 85000,
    renovationBudget: 20000,
  },
  {
    id: '3',
    address: '376 Sandlewood Loop',
    city: 'Avinger',
    state: 'TX',
    zip: '75630',
    lat: addOffset(cityCoordinates['Avinger'].lat),
    lng: addOffset(cityCoordinates['Avinger'].lng),
    listPrice: 45000,
    equityGap: 15000,
    sqft: 1428,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'Section 8',
    rationale: 'Added privacy feature attractive for Section 8 tenants. Rural location may limit rental demand.',
    type: 'House for sale',
    realtor: 'No Realtor Listed',
    url: 'https://www.zillow.com/homedetails/376-Sandlewood-Loop-Avinger-TX-75630/113170821_zpid/',
    details: 'Added privacy',
    ...defaultProps,
    estimatedRent: 950,
    annualTaxes: 1200,
    annualInsurance: 800,
  },
  {
    id: '4',
    address: '404 E Woodland Rd',
    city: 'Marshall',
    state: 'TX',
    zip: '75672',
    lat: addOffset(cityCoordinates['Marshall'].lat),
    lng: addOffset(cityCoordinates['Marshall'].lng),
    listPrice: 45000,
    equityGap: 20000,
    sqft: 1037,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'Wholesaling',
    rationale: 'Low entry point with quick assignment potential. Marshall market showing strong buyer demand.',
    type: 'House for sale',
    realtor: 'CENTURY 21 A SELECT GROUP',
    url: 'https://www.zillow.com/homedetails/404-E-Woodland-Rd-Marshall-TX-75672/52026957_zpid/',
    details: '81 days on Zillow',
    ...defaultProps,
    afterRepairValue: 75000,
  },
  {
    id: '5',
    address: '430 Seminole',
    city: 'Quitman',
    state: 'TX',
    zip: '75783',
    lat: addOffset(cityCoordinates['Quitman'].lat),
    lng: addOffset(cityCoordinates['Quitman'].lng),
    listPrice: 46610,
    equityGap: 12000,
    sqft: 1200,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Caution',
    strategy: 'BRRR',
    rationale: 'Foreclosure property. Missing sqft data requires verification. Rent Ready condition unknown.',
    type: 'Foreclosure',
    realtor: 'STARCREST REALTY, LLC',
    url: 'https://www.zillow.com/homedetails/430-Seminole-Quitman-TX-75783/299965234_zpid/',
    details: '30 days on Zillow',
    ...defaultProps,
    estimatedRent: 850,
  },
  {
    id: '6',
    address: '105 Lodge St',
    city: 'Ore City',
    state: 'TX',
    zip: '75683',
    lat: addOffset(cityCoordinates['Ore City'].lat),
    lng: addOffset(cityCoordinates['Ore City'].lng),
    listPrice: 49999,
    equityGap: 14000,
    sqft: 984,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Gold',
    strategy: 'Owner Finance',
    rationale: 'Small town appeal with owner finance potential. Good for first-time buyer wrap.',
    type: 'House for sale',
    realtor: '1ST TEXAS REALTY SERVICES',
    url: 'https://www.zillow.com/homedetails/105-Lodge-St-Ore-City-TX-75683/331577883_zpid/',
    details: '24 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '7',
    address: '107 Electra St',
    city: 'Longview',
    state: 'TX',
    zip: '75602',
    lat: addOffset(cityCoordinates['Longview'].lat),
    lng: addOffset(cityCoordinates['Longview'].lng),
    listPrice: 53999,
    equityGap: 10000,
    sqft: 1232,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'Section 8',
    rationale: 'Long days on market (243) suggests negotiation room. Standard rental property.',
    type: 'House for sale',
    realtor: '1ST TEXAS REALTY SERVICES',
    url: 'https://www.zillow.com/homedetails/107-Electra-St-Longview-TX-75602/50788070_zpid/',
    details: '243 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '8',
    address: '11006 Fm 225 S',
    city: 'Laneville',
    state: 'TX',
    zip: '75667',
    lat: addOffset(cityCoordinates['Laneville'].lat),
    lng: addOffset(cityCoordinates['Laneville'].lng),
    listPrice: 55000,
    equityGap: 16000,
    sqft: 1590,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Gold',
    strategy: 'Retail Flip',
    rationale: 'Recent $10,000 price cut. Rural flip opportunity with good square footage.',
    type: 'House for sale',
    realtor: 'L4 PROPERTY GROUP',
    url: 'https://www.zillow.com/homedetails/11006-Fm-225-S-Laneville-TX-75667/221428903_zpid/',
    details: 'Price cut: $10,000 (1/29)',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '9',
    address: '110 Acorn Dr',
    city: 'Marshall',
    state: 'TX',
    zip: '75670',
    lat: addOffset(cityCoordinates['Marshall'].lat),
    lng: addOffset(cityCoordinates['Marshall'].lng),
    listPrice: 58989,
    equityGap: 22000,
    sqft: 1800,
    bedrooms: 4,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'BRRR',
    rationale: '4 bedrooms at $32.77/sqft. Excellent rental potential. Traditional uphill architecture adds character.',
    type: 'House for sale',
    realtor: '1ST TEXAS REALTY SERVICES',
    url: 'https://www.zillow.com/homedetails/110-Acorn-Dr-Marshall-TX-75670/52032091_zpid/',
    details: 'Traditional uphill look',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '10',
    address: '908 Burns St',
    city: 'Kilgore',
    state: 'TX',
    zip: '75662',
    lat: addOffset(cityCoordinates['Kilgore'].lat),
    lng: addOffset(cityCoordinates['Kilgore'].lng),
    listPrice: 64999,
    equityGap: 15000,
    sqft: 1336,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'Wholesaling',
    rationale: 'Kilgore market stable. Good wholesale candidate with moderate spread.',
    type: 'House for sale',
    realtor: 'SCM REALTY',
    url: 'https://www.zillow.com/homedetails/908-Burns-St-Kilgore-TX-75662/50774130_zpid/',
    details: '59 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '11',
    address: '410 Timberline Dr',
    city: 'Longview',
    state: 'TX',
    zip: '75604',
    lat: addOffset(cityCoordinates['Longview'].lat),
    lng: addOffset(cityCoordinates['Longview'].lng),
    listPrice: 65000,
    equityGap: 18000,
    sqft: 1508,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Gold',
    strategy: 'Section 8',
    rationale: 'Desirable Longview neighborhood. Strong Section 8 demand in this area.',
    type: 'House for sale',
    realtor: 'REAL BROKER, LLC',
    url: 'https://www.zillow.com/homedetails/410-Timberline-Dr-Longview-TX-75604/50788738_zpid/',
    details: '113 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '12',
    address: '334 County Road 3523',
    city: 'Bullard',
    state: 'TX',
    zip: '75757',
    lat: addOffset(cityCoordinates['Bullard'].lat),
    lng: addOffset(cityCoordinates['Bullard'].lng),
    listPrice: 69900,
    equityGap: 8000,
    sqft: 1136,
    bedrooms: 3,
    bathrooms: 3,
    decision: 'Caution',
    strategy: 'BRRR',
    rationale: 'Foreclosure. 156 days on market indicates potential issues. Due diligence required.',
    type: 'Foreclosure',
    realtor: 'BERKSHIRE HATHAWAY HOMESERVICES MILES REALTY-TYLER',
    url: 'https://www.zillow.com/homedetails/334-County-Road-3523-Bullard-TX-75757/112312142_zpid/',
    details: '156 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '13',
    address: '7227 Forest Hill Dr',
    city: 'Frankston',
    state: 'TX',
    zip: '75763',
    lat: addOffset(cityCoordinates['Frankston'].lat),
    lng: addOffset(cityCoordinates['Frankston'].lng),
    listPrice: 79900,
    equityGap: 35000,
    sqft: 704,
    bedrooms: 2,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'Retail Flip',
    rationale: 'Lake Palestine property! Waterfront premium potential. Foreclosure with massive equity gap.',
    type: 'Foreclosure',
    realtor: 'BERKSHIRE HATHAWAY HOMESERVICES MILES REALTY-TYLER',
    url: 'https://www.zillow.com/homedetails/7227-Forest-Hill-Dr-Frankston-TX-75763/75262895_zpid/',
    details: 'Situated on lake palestine',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '14',
    address: '2472 Lovely Dr',
    city: 'Chandler',
    state: 'TX',
    zip: '75758',
    lat: addOffset(cityCoordinates['Chandler'].lat),
    lng: addOffset(cityCoordinates['Chandler'].lng),
    listPrice: 79900,
    equityGap: 25000,
    sqft: 2380,
    bedrooms: 4,
    bathrooms: 4,
    decision: 'Pass Platinum',
    strategy: 'BRRR',
    rationale: 'Major price cut of $20,000. 4 bed/4 bath at $33.57/sqft is exceptional value.',
    type: 'House for sale',
    realtor: 'JOSEPH WALTER REALTY, LLC',
    url: 'https://www.zillow.com/homedetails/2472-Lovely-Dr-Chandler-TX-75758/75268661_zpid/',
    details: 'Price cut: $20,000 (2/13)',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '15',
    address: '812 Tyler St',
    city: 'Jacksonville',
    state: 'TX',
    zip: '75766',
    lat: addOffset(cityCoordinates['Jacksonville'].lat),
    lng: addOffset(cityCoordinates['Jacksonville'].lng),
    listPrice: 84000,
    equityGap: 12000,
    sqft: 2210,
    bedrooms: 4,
    bathrooms: 2,
    decision: 'Pass Gold',
    strategy: 'Owner Finance',
    rationale: 'Auction property with good square footage. Owner finance candidate for larger family.',
    type: 'Auction',
    realtor: 'STARCREST REALTY',
    url: 'https://www.zillow.com/homedetails/812-Tyler-St-Jacksonville-TX-75766/87224735_zpid/',
    details: '93 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '16',
    address: '330 Francis St',
    city: 'Hawkins',
    state: 'TX',
    zip: '75765',
    lat: addOffset(cityCoordinates['Hawkins'].lat),
    lng: addOffset(cityCoordinates['Hawkins'].lng),
    listPrice: 91000,
    equityGap: 20000,
    sqft: 1679,
    bedrooms: 3,
    bathrooms: 3,
    decision: 'Pass Gold',
    strategy: 'Retail Flip',
    rationale: 'Foreclosure with half-acre lot. Lake area appeal for retail buyers.',
    type: 'Foreclosure',
    realtor: 'CROWNED EAGLE REALTY',
    url: 'https://www.zillow.com/homedetails/330-Francis-St-Hawkins-TX-75765/87608268_zpid/',
    details: 'Almost half an acre',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '17',
    address: '505 Levin St',
    city: 'Marshall',
    state: 'TX',
    zip: '75670',
    lat: addOffset(cityCoordinates['Marshall'].lat),
    lng: addOffset(cityCoordinates['Marshall'].lng),
    listPrice: 97500,
    equityGap: 45000,
    sqft: 2012,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Platinum',
    strategy: 'Retail Flip',
    rationale: 'MASSIVE price cut of $52,500! Motivated seller. Excellent flip opportunity.',
    type: 'House for sale',
    realtor: 'FATHOM REALTY',
    url: 'https://www.zillow.com/homedetails/505-Levin-St-Marshall-TX-75670/52038878_zpid/',
    details: 'Price cut: $52,500 (2/14)',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '18',
    address: '210 S Adams Ave',
    city: 'Tyler',
    state: 'TX',
    zip: '75702',
    lat: addOffset(cityCoordinates['Tyler'].lat),
    lng: addOffset(cityCoordinates['Tyler'].lng),
    listPrice: 99500,
    equityGap: 15000,
    sqft: 2808,
    bedrooms: 5,
    bathrooms: 3,
    decision: 'Pass Gold',
    strategy: 'Section 8',
    rationale: 'Multi-family potential. 5 bedrooms ideal for Section 8 voucher premium.',
    type: 'Multi-family home for sale',
    realtor: 'THE BRIAN CHINN TEAM, EXP REALTY',
    url: 'https://www.zillow.com/homedetails/210-S-Adams-Ave-Tyler-TX-75702/52295792_zpid/',
    details: '284 days on Zillow',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '19',
    address: '205 N Robinson St',
    city: 'Big Sandy',
    state: 'TX',
    zip: '75755',
    lat: addOffset(cityCoordinates['Big Sandy'].lat),
    lng: addOffset(cityCoordinates['Big Sandy'].lng),
    listPrice: 100000,
    equityGap: 5000,
    sqft: 800,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Hard Fail',
    strategy: 'Wholesaling',
    rationale: 'Price per sqft too high at $125. Limited spread for wholesale. Original wood floors nice but not enough.',
    type: 'House for sale',
    realtor: 'LONE STAR REALTY - LAKE FORK',
    url: 'https://www.zillow.com/homedetails/205-N-Robinson-St-Big-Sandy-TX-75755/331576816_zpid/',
    details: 'Original wood floors',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '20',
    address: '201 Travis St',
    city: 'Henderson',
    state: 'TX',
    zip: '75654',
    lat: addOffset(cityCoordinates['Henderson'].lat),
    lng: addOffset(cityCoordinates['Henderson'].lng),
    listPrice: 104900,
    equityGap: 10000,
    sqft: 1488,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'BRRR',
    rationale: 'Foreclosure with some updating needed. Moderate rental potential in Henderson.',
    type: 'Foreclosure',
    realtor: 'TX FARMS & RANCHES/PARK VILLAGE',
    url: 'https://www.zillow.com/homedetails/201-Travis-St-Henderson-TX-75654/87517400_zpid/',
    details: 'Some updating',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '21',
    address: '10490 Browning St',
    city: 'Brownsboro',
    state: 'TX',
    zip: '75756',
    lat: addOffset(cityCoordinates['Brownsboro'].lat),
    lng: addOffset(cityCoordinates['Brownsboro'].lng),
    listPrice: 112500,
    equityGap: 8000,
    sqft: 540,
    bedrooms: 2,
    bathrooms: 2,
    decision: 'Hard Fail',
    strategy: 'Retail Flip',
    rationale: 'Tiny home at $208/sqft. Not viable for any strategy at this price point.',
    type: 'House for sale',
    realtor: 'No Realtor Listed',
    url: 'https://www.zillow.com/homedetails/10490-Browning-St-Brownsboro-TX-75756/2088024173_zpid/',
    details: 'Many mature trees',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '22',
    address: '325 W 4th St',
    city: 'Tyler',
    state: 'TX',
    zip: '75701',
    lat: addOffset(cityCoordinates['Tyler'].lat),
    lng: addOffset(cityCoordinates['Tyler'].lng),
    listPrice: 149900,
    equityGap: 18000,
    sqft: 2058,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'Owner Finance',
    rationale: 'Foreclosure in Tyler with recent price cut. Good owner finance candidate.',
    type: 'Foreclosure',
    realtor: 'NE TEXAS REGIONAL REALTY',
    url: 'https://www.zillow.com/homedetails/325-W-4th-St-Tyler-TX-75701/52297817_zpid/',
    details: 'Price cut: $10,000 (2/9)',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '23',
    address: '309 E Brandon St',
    city: 'Overton',
    state: 'TX',
    zip: '75684',
    lat: addOffset(cityCoordinates['Overton'].lat),
    lng: addOffset(cityCoordinates['Overton'].lng),
    listPrice: 149900,
    equityGap: 12000,
    sqft: 1700,
    bedrooms: 3,
    bathrooms: 3,
    decision: 'Pass Gold',
    strategy: 'BRRR',
    rationale: 'Multi-family property with price cut. Good BRRR candidate for rental portfolio.',
    type: 'Multi-family home for sale',
    realtor: 'SIMPSON REALTY GROUP',
    url: 'https://www.zillow.com/homedetails/309-E-Brandon-St-Overton-TX-75684/331455369_zpid/',
    details: 'Price cut: $10,000 (2/7)',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '24',
    address: '8439 Hyena Rd',
    city: 'Gilmer',
    state: 'TX',
    zip: '75644',
    lat: addOffset(cityCoordinates['Gilmer'].lat),
    lng: addOffset(cityCoordinates['Gilmer'].lng),
    listPrice: 149900,
    equityGap: 15000,
    sqft: 1664,
    bedrooms: 3,
    bathrooms: 2,
    decision: 'Pass Silver',
    strategy: 'Section 8',
    rationale: 'Spring-fed water well is unique feature. Rural rental potential for long-term tenants.',
    type: 'House for sale',
    realtor: 'TEXAS REAL ESTATE EXECUTIVES-GILMER',
    url: 'https://www.zillow.com/homedetails/8439-Hyena-Rd-Gilmer-TX-75644/304808536_zpid/',
    details: 'Spring-fed water well',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: '25',
    address: '18737 Saddleback Ln',
    city: 'Flint',
    state: 'TX',
    zip: '75762',
    lat: addOffset(cityCoordinates['Flint'].lat),
    lng: addOffset(cityCoordinates['Flint'].lng),
    listPrice: 150000,
    equityGap: 10000,
    sqft: 2200,
    bedrooms: 4,
    bathrooms: 3,
    decision: 'Caution',
    strategy: 'Retail Flip',
    rationale: 'Higher price point limits flip margin. Great yard but market timing risk. Rent Ready condition unknown.',
    type: 'House for sale',
    realtor: "STAPLES SOTHEBY'S INTERNATIONAL REALTY",
    url: 'https://www.zillow.com/homedetails/18737-Saddleback-Ln-Flint-TX-75762/52330078_zpid/',
    details: 'Great yard',
    images: [],
    estimatedRent: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    renovationBudget: 0,
    afterRepairValue: 0,
    notes: "",
    createdAt: "",
    updatedAt: ""
  },
];

// Helper functions for data analysis
export const getPricePerSqft = (property: Property): number => {
  if (property.sqft <= 0) return 0;
  return property.listPrice / property.sqft;
};

export const getPricePerDoor = (property: Property): number => {
  if (property.bedrooms <= 0) return 0;
  return property.listPrice / property.bedrooms;
};

export const getAveragePricePerSqft = (): number => {
  const validProperties = properties.filter(p => p.sqft > 0);
  if (validProperties.length === 0) return 0;
  const total = validProperties.reduce((sum, p) => sum + getPricePerSqft(p), 0);
  return total / validProperties.length;
};

export const getDecisionColor = (decision: Decision): string => {
  switch (decision) {
    case 'Pass Platinum':
      return '#10b981'; // green
    case 'Pass Gold':
      return '#f59e0b'; // yellow/gold
    case 'Pass Silver':
      return '#f97316'; // orange
    case 'Hard Fail':
      return '#ef4444'; // red
    case 'Caution':
      return '#8b5cf6'; // purple
    default:
      return '#64748b'; // gray
  }
};

export const getStrategyProperties = (strategy: Strategy): Property[] => {
  return properties.filter(p => p.strategy === strategy);
};

export const getDecisionProperties = (decision: Decision): Property[] => {
  return properties.filter(p => p.decision === decision);
};

export const searchProperties = (query: string): Property[] => {
  const lowerQuery = query.toLowerCase();
  return properties.filter(p => 
    p.rationale.toLowerCase().includes(lowerQuery) ||
    p.address.toLowerCase().includes(lowerQuery) ||
    p.city.toLowerCase().includes(lowerQuery) ||
    p.details.toLowerCase().includes(lowerQuery)
  );
};

// Financial calculation functions
export const calculateCapRate = (property: Property): number => {
  if (property.listPrice <= 0) return 0;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  return (noi / property.listPrice) * 100;
};

export const calculateCashOnCashReturn = (
  property: Property, 
  downPaymentPercent: number = 25,
  interestRate: number = 7.5
): number => {
  const downPayment = property.listPrice * (downPaymentPercent / 100);
  const loanAmount = property.listPrice - downPayment;
  const monthlyPayment = (loanAmount * (interestRate / 100 / 12)) / (1 - Math.pow(1 + interestRate / 100 / 12, -360));
  const annualMortgage = monthlyPayment * 12;
  const annualRent = property.estimatedRent * 12;
  const noi = annualRent - property.annualTaxes - property.annualInsurance;
  const annualCashFlow = noi - annualMortgage;
  const totalCashInvested = downPayment + property.renovationBudget + property.annualTaxes + property.annualInsurance;
  if (totalCashInvested <= 0) return 0;
  return (annualCashFlow / totalCashInvested) * 100;
};

export const calculateMAO = (
  property: Property,
  targetProfitPercent: number = 20
): number => {
  // MAO = ARV * (1 - targetProfit%) - Renovation Costs
  if (property.afterRepairValue <= 0) return 0;
  const mao = property.afterRepairValue * (1 - targetProfitPercent / 100) - property.renovationBudget;
  return Math.max(0, mao);
};

export const calculateOnePercentRule = (property: Property): boolean => {
  if (property.listPrice <= 0) return false;
  const monthlyRent = property.estimatedRent;
  return monthlyRent >= property.listPrice * 0.01;
};

export const calculateGrossYield = (property: Property): number => {
  if (property.listPrice <= 0) return 0;
  const annualRent = property.estimatedRent * 12;
  return (annualRent / property.listPrice) * 100;
};

```

---