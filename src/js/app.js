/*
 *
 *  Manifest "app.js"
 *  author: ianmilliken
 *
 */

import foo from "./test";

$(document).ready(function() {

   $('.axios-nav-link').click( e => {
      e.preventDefault()
      alert("Axios link clicked!")
   });

   //  -----------------------------
   //  Hamburger and drawer
   //  -----------------------------

   var add_classes, close, drawer, hamburger, overlay, remove_classes;

   hamburger = $('#site-burger');
   overlay = $('.site-overlay');
   drawer = $('.site-drawer');
   close = $('.site-drawer__close');

   add_classes = function() {
     overlay.addClass('site-overlay--active');
     drawer.addClass('site-drawer--active');
   };

   remove_classes = function() {
     overlay.removeClass('site-overlay--active');
     drawer.removeClass('site-drawer--active');
   };

   hamburger.off();

   hamburger.on('click', function(event) {
     event.preventDefault();
     add_classes();
   });

   close.off();

   close.on('click', function(event) {
     event.preventDefault();
     remove_classes();
   });

});
