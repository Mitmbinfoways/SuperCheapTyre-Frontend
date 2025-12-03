import{j as e,u as C,v as S,w as E,r as m,A as L,R as q}from"./react-vendor-Dj5e1rff.js";import{f as g,s as f,c as y,q as P}from"./index-CZ-MNBpg.js";import{u as v}from"./router-8ngtUVIW.js";import{T as B}from"./Toast-DT4nCAvh.js";import"./vendor-CM7ll7Aw.js";const M=({item:s,productStock:r,loadingStock:x,onQuantityChange:u,onRemove:p})=>{const b=v(),h=x||r!==void 0&&s.quantity>=r;return e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[e.jsx("div",{className:"flex-shrink-0 w-full sm:w-32 h-32 rounded-lg flex items-center justify-center cursor-pointer border border-black",onClick:()=>b(`/productdetails/${s.id}`),children:e.jsx("img",{src:s.image,alt:s.name,className:"w-28 h-28 object-contain"})}),e.jsxs("div",{className:"flex-grow flex flex-col sm:flex-row justify-between gap-4",children:[e.jsxs("div",{className:"flex flex-col justify-between cursor-pointer",onClick:()=>b(`/productdetails/${s.id}`),children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-lexend text-xl",children:s.name}),e.jsxs("p",{className:" flex font-lexend text-sm mt-1 text-[#8C8C8C] gap-1",children:[e.jsx("p",{className:"text-[#888888] font-bold",children:"Size:"})," ",s.size]}),e.jsx("p",{className:"font-roboto text-[#8C8C8C] text-base",children:s.description})]}),s.type==="service"?e.jsxs("p",{className:"font-bold text-gray-900 mb-3 text-xl",children:["Starting From AU$",s.price," ",e.jsx("sup",{className:"text-sm",children:"EA"})]}):e.jsx("p",{className:"font-satoshi font-bold text-2xl mt-2 sm:mt-0 text-[#000000]",children:g(s.price)})]}),e.jsxs("div",{className:"flex flex-col justify-between items-start sm:items-end",children:[e.jsx("button",{onClick:()=>p(s.id),className:"text-primary hover:text-red-700",children:e.jsx(C,{size:24,fill:"red",className:""})}),e.jsxs("div",{className:"flex items-center gap-5 bg-[#F0F0F0] rounded-full px-5 py-3 mt-2",children:[e.jsx("button",{onClick:()=>u(s.id,s.quantity-1),className:s.quantity===1?"text-gray-400":"text-black",disabled:s.quantity===1,children:e.jsx(S,{size:20})}),e.jsx("span",{className:"font-satoshi font-medium text-sm w-4 text-center",children:s.quantity}),e.jsx("button",{onClick:()=>u(s.id,s.quantity+1),className:h?"text-gray-400":"text-black",disabled:h,children:e.jsx(E,{size:20})})]})]})]})]})},T=({label:s,value:r,isDiscount:x=!1})=>e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"font-lexend text-xl text-black/60",children:s}),e.jsxs("p",{className:`font-lexend text-xl font-medium ${x?"text-primary font-satoshi font-bold":"text-black"}`,children:[x?"-":"",g(r)]})]}),A=({totals:s})=>{const[r,x]=m.useState("partial"),u=v();m.useEffect(()=>{const d=f("selectedPaymentOption","partial");x(d)},[]),m.useEffect(()=>{y("selectedPaymentOption",r)},[r]);const b=(()=>{const d=s.subtotal;return r==="full"?d:d*.25})(),h=()=>{const d=f("cartItems",[]);if(!(Array.isArray(d)?d:[]).length){B({message:"Please add at least one item to cart",type:"error"}),u("/tyres");return}y("selectedPaymentOption",r),u("/appointment")};return e.jsxs("div",{className:"bg-white rounded-2xl border border-border-gray p-6 space-y-6 sticky top-8",children:[e.jsx("h2",{className:"font-satoshi font-bold text-2xl",children:"Order Summary"}),e.jsx("div",{className:"space-y-5",children:e.jsx(T,{label:"Subtotal",value:s.subtotal})}),e.jsx("hr",{className:"border-border-gray"}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("p",{className:"font-lexend font-medium text-xl",children:"Total"}),e.jsx("p",{className:"font-lexend font-medium text-2xl",children:g(b)})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"font-lexend text-2xl",children:"Payment Options:"}),e.jsx("div",{className:"grid sm:flex-row sm:items-center gap-4 sm:gap-2",children:e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer font-lexend text-lg",children:[e.jsx("input",{type:"radio",name:"payment",value:"partial",checked:r==="partial",onChange:d=>x(d.target.value),className:"w-4 h-4 accent-black"}),"Partial Payment (25%)"]})}),e.jsx("div",{className:"bg-blue-50 p-3 rounded-lg",children:e.jsx("p",{className:"text-sm text-blue-800",children:r==="full"?"You will be charged the full amount.":"You will be charged 25% of the total now, with the remainder payable at the store."})})]}),e.jsxs("button",{onClick:h,className:"w-full bg-primary text-white font-lexend font-semibold text-base py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-red-700 transition-colors",children:["Go to Checkout",e.jsx(L,{size:24})]})]})},I=()=>{const s=v(),[r,x]=m.useState(()=>{const t=f("cartItems",[]);return Array.isArray(t)?t:[]}),[u,p]=m.useState({}),[b,h]=m.useState(!0),[d,w]=m.useState({subtotal:0,discount:0,delivery:15,total:0});m.useEffect(()=>{(async()=>{if(r.length===0){h(!1);return}try{const n=r.map(async l=>{if(l.type==="service")return{id:l.id,stock:void 0};try{const o=await P(l.id);return{id:l.id,stock:o.data.data.stock||0}}catch(o){return console.error(`Error fetching stock for product ${l.id}:`,o),{id:l.id,stock:0}}}),c=await Promise.all(n),a={};c.forEach(({id:l,stock:o})=>{a[l]=o}),p(a)}catch(n){console.error("Error fetching product stocks:",n)}finally{h(!1)}})()},[r]),m.useEffect(()=>{if(!Array.isArray(r)){console.error("Cart items is not an array:",r);return}const t=r.reduce((o,i)=>o+i.price*i.quantity,0),n=t*.2,c=15,a=t-n+c;w({subtotal:t,discount:n,delivery:c,total:a}),y("cartItems",r);const l=r.reduce((o,i)=>o+(i.quantity||1),0);localStorage.setItem("cartCount",String(l)),window.dispatchEvent(new StorageEvent("storage",{key:"cartCount",newValue:String(l)}))},[r]);const j=(t,n)=>{if(n<1)return;const c=r.find(a=>a.id===t);if(c&&c.type!=="service"){const a=u[t];if(a!==void 0&&n>a)return}x(a=>a.map(l=>l.id===t?{...l,quantity:n}:l))},k=t=>{const n=document.createElement("div");n.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",n.innerHTML=`
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Remove Item</h3>
          <p class="text-gray-500 mb-6">Are you sure you want to remove this item from your cart?</p>
          <div class="flex gap-3 justify-center">
            <button id="cancel-btn" class="px-5 py-2.5 text-sm font-lexend font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button id="confirm-btn" class="px-5 py-2.5 text-sm font-lexend font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(n);const c=n.querySelector("#confirm-btn"),a=n.querySelector("#cancel-btn"),l=n.querySelector("#close-modal-btn"),o=()=>{document.body.removeChild(n)};c.addEventListener("click",()=>{x(i=>i.filter(N=>N.id!==t)),o()}),a.addEventListener("click",o),l.addEventListener("click",o),n.addEventListener("click",i=>{i.target===n&&o()})};return e.jsxs("div",{className:"max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-5",children:[e.jsx("h1",{className:"font-lexend font-medium text-3xl text-primary mb-7 px-3",children:"Your Cart"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8 items-start",children:[e.jsx("div",{className:"lg:col-span-2 space-y-6",children:e.jsxs("div",{className:"bg-white rounded-2xl border border-border-gray p-6 space-y-6",children:[r.map((t,n)=>e.jsxs(q.Fragment,{children:[e.jsx(M,{item:t,productStock:u[t.id],loadingStock:b,onQuantityChange:j,onRemove:k}),n<r.length-1&&e.jsx("hr",{className:"border-border-gray"})]},t.id)),r.length===0&&e.jsxs("div",{className:"text-center py-8",children:[e.jsx("p",{className:"text-gray-500 text-lg",children:"Your cart is empty"}),e.jsx("button",{onClick:()=>{const t=document.createElement("div");t.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",t.innerHTML=`
                      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
                        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <div class="text-center">
                          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Select Product Type</h3>
                          <p class="text-gray-500 mb-6">What would you like to add to your cart?</p>
                          <div class="flex flex-col gap-3">
                            <button id="tyres-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Tyres
                            </button>
                            <button id="wheels-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Wheels
                            </button>
                            <button id="services-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Services
                            </button>
                          </div>
                        </div>
                      </div>
                    `,document.body.appendChild(t);const n=t.querySelector("#tyres-btn"),c=t.querySelector("#wheels-btn"),a=t.querySelector("#services-btn"),l=t.querySelector("#close-modal-btn"),o=()=>{document.body.removeChild(t)};n.addEventListener("click",()=>{s("/tyres"),o()}),c.addEventListener("click",()=>{s("/wheels"),o()}),a.addEventListener("click",()=>{s("/services"),o()}),l.addEventListener("click",o),t.addEventListener("click",i=>{i.target===t&&o()})},className:"mt-4 bg-primary text-white font-lexend font-semibold text-xl py-3 px-6 rounded-lg hover:bg-red-700 transition-colors",children:"Continue Shopping"})]}),r.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("hr",{className:"border-border-gray"}),e.jsx("button",{onClick:()=>{const t=document.createElement("div");t.className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",t.innerHTML=`
                      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative">
                        <button id="close-modal-btn" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <div class="text-center">
                          <h3 class="text-xl font-lexend font-semibold text-gray-900 mb-2">Select Product Type</h3>
                          <p class="text-gray-500 mb-6">What would you like to add to your cart?</p>
                          <div class="flex flex-col gap-3">
                            <button id="tyres-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Tyres
                            </button>
                            <button id="wheels-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Wheels
                            </button>
                            <button id="services-btn" class="px-5 py-3 text-base font-lexend font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors">
                              Services
                            </button>
                          </div>
                        </div>
                      </div>
                    `,document.body.appendChild(t);const n=t.querySelector("#tyres-btn"),c=t.querySelector("#wheels-btn"),a=t.querySelector("#services-btn"),l=t.querySelector("#close-modal-btn"),o=()=>{document.body.removeChild(t)};n.addEventListener("click",()=>{s("/tyres"),o()}),c.addEventListener("click",()=>{s("/wheels"),o()}),a.addEventListener("click",()=>{s("/services"),o()}),l.addEventListener("click",o),t.addEventListener("click",i=>{i.target===t&&o()})},className:"w-full bg-primary text-white font-lexend font-semibold text-xl py-4 rounded-lg hover:bg-red-700 transition-colors",children:"Add Another Product"})]})]})}),e.jsx("div",{className:"lg:col-span-1",children:e.jsx(A,{totals:d})})]})]})};function W(){return e.jsx("div",{className:"flex flex-col min-h-screen",children:e.jsx("main",{className:"flex-grow",children:e.jsx(I,{})})})}export{W as default};
