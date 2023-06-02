import { URL_FRONTEND } from "./assets/utils"
import Swal from 'sweetalert2'

export const Autenticacion = ( orderID, monto, email_paypal, id_file, file_name ) => {
    const login = ''
    const password = ''
    fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token/", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${window.btoa(`${login}:${password}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
            "Accept": "*/*",
            "Accept-Encoding": "gzip,deflate",
            "Connection": "keep-alive"
        },
        body: "grant_type=client_credentials"
    }).then(e => e.json())
    .then((result) => {
        const { access_token } = result
        comprobar_pago( access_token, orderID, monto, email_paypal, id_file, file_name )
    })
}

const comprobar_pago = ( access_token, orderID, monto, email_paypal, id_file, file_name ) => {
    fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders/' + orderID, {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(e => e.json()).then(( result ) => {
        if(result.status == "APPROVED") {
            EnviarPago( access_token, orderID, monto, email_paypal, id_file, file_name )
        }
    })
}

const EnviarPago = ( access_token, orderID, monto, email_paypal, id_file, file_name ) => {
    let file_download = `${id_file}_${file_name}`
    Swal.fire({
        icon: 'warning',
        title: 'Terminando proceso de pago',
        text: 'Espere por favor!!',
        showConfirmButton: false,
        allowOutsideClick: false
    })
    fetch(`${URL_FRONTEND}sendPayment.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `monto=${monto}&access_token=${access_token}&receiver=${email_paypal}&orderID=${orderID}&id_file=${id_file}&file_name=${file_download}`
    })
    .then(e => e.json())
    .then(e => {

        fetch(`${URL_FRONTEND}getLinkDownload.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "file="+file_download
        }).then(e => e.blob())
        .then(e => {
            let f = new FileReader()
            f.onload = (res) => {

                let link = window.document.createElement('a')
                link.innerText = 'Download File'
                link.setAttribute('download','')
                link.href = res.target.result
                link.click()
                document.querySelector('#_download_').appendChild(link)

            }
            f.readAsDataURL(e)
        })

        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                position: 'top-end',
                toast: true,
                title: 'Pago exitoso!!',
                showConfirmButton: false,
                allowOutsideClick: false,
                timer: 4000
            })

            let JH = {
                orderID, monto, email_paypal, id_file, file_name
            }

            if( !localStorage.getItem('compras') ) {
                localStorage.setItem('compras', JSON.stringify(JH))
            }else{
                let lista = []
                let compras = JSON.parse(localStorage.getItem('compras'))
                lista.push( JH, compras )
                localStorage.setItem('compras', JSON.stringify( lista ))
            }
        }, 1100)
    })
}

/** 
 * 
    sb-fbnor5829259@personal.example.com
    6sY%$DT1

    sb-of5wn5764259@business.example.com
    s7.J!8Wv    |     48PKNK8DVJMSY326

    sb-uxxdg15885974@personal.example.com
    tlGd1U.j
 * 
*/
