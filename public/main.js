(function() {
  'use strict'

  const _csrf = $('#pay').data('csrf')

  $('#pay').click(() => {
    $.ajax({
      url: '/checkout/pay',
      method: 'POST',
      data: {
        _csrf
      },
      success: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
}())
