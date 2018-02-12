(function() {
  'use strict'

  const _csrf = $('#pay').data('csrf')
  const modalQuery = $('#modal-query')

  /**
   * 对话框的启用状态。
   */
  modalQuery.on('hidden.bs.modal', () => {
    localStorage.setItem('#modal-query', 'hide')
  })

  const modalQueryState = localStorage.getItem('#modal-query')

  if (modalQueryState === 'show') {
    modalQuery.modal()
  }

  /**
   * 请求支付。
   */
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

          window.location.href = response
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })

  /**
   * 查询支付结果。
   */
  $('#order-query').click(() => {
    $.ajax({
      url: '/checkout/query',
      method: 'POST',
      data: {
        _csrf
      },
      success: (response) => {
        console.log(response)
        if (response === 'success') {
          window.location.href = '/checkout/completed'
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
}())
