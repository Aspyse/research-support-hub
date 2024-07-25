/* This is the JS file for sample-partial.hbs
 * Use it to write and import client-side code (e.g. AJAX).
 */
$(document).ready(function () {
  $('.sample-partial').click(function () {
    const temp = $(this).css('background-color')
    $(this).animate({ bottom: '-=0.25rem' }, 'fast')
    $(this).css('background-color', $(this).css('color'))
    $(this).css('color', temp)
    $(this).css('border-width', ($(this).css('border-width') === 1) ? '0px' : '1px')
    $(this).animate({ bottom: '+=0.25rem' }, 'fast')
  })
})
