(function() {
  'use strict'

  const _csrf = $('#pay').data('csrf')
  const modalQuery = $('#modal-query')

  modalQuery.on('hidden.bs.modal', () => {
    localStorage.setItem('#modal-query', 'hide')
  })

  const modalQueryState = localStorage.getItem('#modal-query')

  if (modalQueryState === 'show') {
    modalQuery.modal()
  }

  const wxPay = (wxJSApiParams) => {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      wxJSApiParams,
      (response) => {
        console.log(response)
      }
    )
  }

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
          modalQuery.modal()
          localStorage.setItem('#modal-query', 'show')

          wxPay(response)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })

  $('#order-query').click(() => {
    $.ajax({
      url: '/checkout/query',
      method: 'POST',
      data: {
        _csrf
      },
      success: (response) => {
        switch (response.trade_state) {
          case 'SUCCESS':
            window.location.href = '/checkout/completed'
            break
          default:
            console.log(response)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
}())
