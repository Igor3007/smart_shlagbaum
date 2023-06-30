 document.addEventListener("DOMContentLoaded", function (event) {

     const API_YMAPS = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';


     /* =================================================
     load ymaps api
     =================================================*/

     window.loadApiYmaps = function (callback) {

         if (window.ymaps == undefined) {
             const script = document.createElement('script')
             script.src = API_YMAPS
             script.onload = () => {
                 callback(window.ymaps)
             }
             document.head.append(script)
         } else {
             callback(window.ymaps)
         }

     }

     /* =================================================
     preloader
     ================================================= */

     class Preloader {

         constructor() {
             this.$el = this.init()
             this.state = false
         }

         init() {
             const el = document.createElement('div')
             el.classList.add('loading')
             el.innerHTML = '<div class="indeterminate"></div>';
             document.body.append(el)
             return el;
         }

         load() {

             this.state = true;

             setTimeout(() => {
                 if (this.state) this.$el.classList.add('load')
             }, 300)
         }

         stop() {

             this.state = false;

             setTimeout(() => {
                 if (this.$el.classList.contains('load'))
                     this.$el.classList.remove('load')
             }, 200)
         }

     }

     window.preloader = new Preloader();



     /* ==============================================
     mobile menu
     ============================================== */

     function Status() {

         this.containerElem = '#status'
         this.headerElem = '#status_header'
         this.msgElem = '#status_msg'
         this.btnElem = '#status_btn'
         this.timeOut = 10000,
             this.autoHide = true

         this.init = function () {
             let elem = document.createElement('div')
             elem.setAttribute('id', 'status')
             elem.innerHTML = '<div id="status_header"></div> <div id="status_msg"></div><div id="status_btn"></div>'
             document.body.append(elem)

             document.querySelector(this.btnElem).addEventListener('click', function () {
                 this.parentNode.setAttribute('class', '')
             })
         }

         this.msg = function (_msg, _header) {
             _header = (_header ? _header : 'Успешно')
             this.onShow('complete', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }
         this.err = function (_msg, _header) {
             _header = (_header ? _header : 'Ошибка')
             this.onShow('error', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }
         this.wrn = function (_msg, _header) {
             _header = (_header ? _header : 'Внимание')
             this.onShow('warning', _header, _msg)
             if (this.autoHide) {
                 this.onHide();
             }
         }

         this.onShow = function (_type, _header, _msg) {
             document.querySelector(this.headerElem).innerText = _header
             document.querySelector(this.msgElem).innerText = _msg
             document.querySelector(this.containerElem).classList.add(_type)
         }

         this.onHide = function () {
             setTimeout(() => {
                 document.querySelector(this.containerElem).setAttribute('class', '')
             }, this.timeOut);
         }

     }

     window.STATUS = new Status();
     const STATUS = window.STATUS;
     STATUS.init();

     /******************************************** 
      * ajax request
      ********************************************/

     window.ajax = function (params, response) {

         //params Object
         //dom element
         //collback function

         window.preloader.load()

         let xhr = new XMLHttpRequest();
         xhr.open((params.type ? params.type : 'POST'), params.url)

         if (params.responseType == 'json') {
             xhr.responseType = 'json';
             xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
             xhr.send(JSON.stringify(params.data))
         } else {

             let formData = new FormData()

             for (key in params.data) {
                 formData.append(key, params.data[key])
             }

             xhr.send(formData)

         }

         xhr.onload = function () {

             response ? response(xhr.status, xhr.response) : ''

             window.preloader.stop()

             setTimeout(function () {
                 if (params.btn) {
                     params.btn.classList.remove('btn-loading')
                 }
             }, 300)
         };

         xhr.onerror = function () {
             window.STATUS.err('Error: ajax request failed')
         };

         xhr.onreadystatechange = function () {

             if (xhr.readyState == 3) {
                 if (params.btn) {
                     params.btn.classList.add('btn-loading')
                 }
             }

         };
     }

     /* ==============================================
     mobile menu
     ============================================== */

     if (document.querySelector('[data-menu="btn"]')) {
         const elContainer = document.querySelector('[data-menu="container"]')
         const elButton = document.querySelector('[data-menu="btn"]')

         function mobileMenu(params) {
             this.el = params.elContainer || false;
             this.button = params.elButton;
             this.state = 'close';

             this.open = function () {
                 this.el ? this.el.classList.add('open') : ''
                 this.button.classList.add('open')
                 document.body.classList.add('hidden')
                 document.body.classList.add('open-mobile-menu')
                 this.state = 'open';

             }

             this.close = function () {

                 this.el ? this.el.classList.add('close-animate') : false
                 this.button.classList.remove('open')

                 setTimeout(() => {
                     this.el ? this.el.classList.remove('open') : false
                     this.el ? this.el.classList.remove('close-animate') : false
                     document.body.classList.remove('hidden')
                     document.body.classList.remove('open-mobile-menu')
                     this.state = 'close'
                 }, 200)

             }

             this.toggle = function () {
                 if (this.state == 'close') this.open()
                 else this.close()
             }
         }

         window.menuInstanse = new mobileMenu({
             elButton,
             elContainer
         })

         elButton.addEventListener('click', function () {
             window.menuInstanse.toggle()
         })
     }


     /* ==============================================
     select
     ============================================== */

     // public methods
     // select.afSelect.open()
     // select.afSelect.close()
     // select.afSelect.update()

     const selectCustom = new afSelect({
         selector: 'select'
     })

     selectCustom.init()


     /* =================================================
     scroll
     ================================================= */

     window.scrollToTargetAdjusted = function (elem) {

         //elem string selector

         if (!document.querySelector(elem)) return false;

         let element = document.querySelector(elem);
         let headerOffset = 0;
         let elementPosition = element.offsetTop
         let offsetPosition = elementPosition - headerOffset;

         var offset = element.getBoundingClientRect();

         window.scrollTo({
             top: offset.top,
             behavior: "smooth"
         });
     }

     /* ==================================================
     maska 
     ==================================================*/

     function initMaska() {
         const {
             MaskInput,
         } = Maska
         new MaskInput("[data-maska]")
     }

     initMaska();

     /* ==================================================
     find 
     ==================================================*/

     window.getScrollBarWidth = function () {

         // Creating invisible container
         const outer = document.createElement('div');
         outer.style.visibility = 'hidden';
         outer.style.overflow = 'scroll'; // forcing scrollbar to appear
         outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
         document.body.appendChild(outer);

         // Creating inner element and placing it in the container
         const inner = document.createElement('div');
         outer.appendChild(inner);

         // Calculating difference between container's full width and the child width
         const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

         // Removing temporary elements from the DOM
         outer.parentNode.removeChild(outer);

         return scrollbarWidth;

     }

     /* ====================================================
     map footer
     ====================================================*/

     function initMapFooter() {
         window.loadApiYmaps((ymaps) => {

             //map footer
             if (document.querySelector('#footer-minimap')) {

                 const coordinates = document.querySelector('#footer-minimap').dataset.coordinates.split(',')
                 ymaps.ready(function () {
                     const myMap = new ymaps.Map('footer-minimap', {
                         center: coordinates,
                         zoom: 14,
                         controls: []
                     }, {
                         searchControlProvider: 'yandex#search',
                         suppressMapOpenBlock: true
                     });
                     const myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                         hintContent: 'Мой умный шлагбаум',
                     }, {
                         iconLayout: 'default#image',
                         iconImageHref: '/img/svg/ic_pin.svg',
                         iconImageSize: [60, 68],
                         iconImageOffset: [-30, -68]
                     });
                     myMap.geoObjects.add(myPlacemark)
                 })
             }

             //map contacts
             if (document.querySelector('#contact-minimap')) {

                 const coordinates = document.querySelector('#contact-minimap').dataset.coordinates.split(',')
                 ymaps.ready(function () {
                     const myMap = new ymaps.Map('contact-minimap', {
                         center: coordinates,
                         zoom: 14,
                         controls: []
                     }, {
                         searchControlProvider: 'yandex#search',
                         suppressMapOpenBlock: true
                     });
                     const myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                         hintContent: 'Мой умный шлагбаум',
                     }, {
                         iconLayout: 'default#image',
                         iconImageHref: '/img/svg/ic_pin.svg',
                         iconImageSize: [60, 68],
                         iconImageOffset: [-30, -68]
                     });
                     myMap.geoObjects.add(myPlacemark)
                 })
             }
         })
     }

     window.addEventListener('scroll', e => {

         let posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

         if (posTop > 200 && window.mapFooterInit == undefined) {
             initMapFooter();
             window.mapFooterInit = true
         }
     })

     /* =================================================
     faq
     =================================================*/

     if (document.querySelectorAll('.faq-item__question')) {

         const faqItems = document.querySelectorAll('.faq-item__question')


         faqItems.forEach(function (item, index) {
             item.addEventListener('click', function () {
                 this.parentNode.classList.toggle('open')
             })
         })

     }

     /* =================================================
     popups
     =================================================*/

     if (document.querySelector('[data-modal]')) {
         const items = document.querySelectorAll('[data-modal]')

         items.forEach(item => {
             item.addEventListener('click', e => {

                 window.ajax({
                     type: 'GET',
                     url: item.dataset.modal
                 }, (status, response) => {

                     const instansePopup = new afLightbox({
                         mobileInBottom: true
                     })
                     instansePopup.open(response, (instanse) => {
                         initMaska()
                     })
                 })

             })
         })
     }



 });