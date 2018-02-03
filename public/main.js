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
        if (response) {
          $('#modal-query').modal()
          window.location.href = response
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
}())
