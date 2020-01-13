'use strict'
const responses = require('../config/responses').responses,
    email_config = require('../config/email')

async function getTemplate(type_email, data)
{
    var style_message = `
        <style>
            .body_email_text
            {
                font-size: 1.2em;
                border-radius: 10px;
            }
            .logo
            {
                width: 75%;
                height: 10vh;
            }
            .logo_favicon
            {
                width: 50px;
                height: 50px;
            }
            .v_align_center
            {
                vertical-align: middle;
            }
            .gray_background 
            {
                background: #E1E1E3;
            }
            .white_background
            {
                background: white;
            }
            .black_background
            {
                background: black;
            }
            .bold
            {
                font-weight: bold;
            }
            .white_text 
            {
                color: white;
            }
            .black_text 
            {
                color: black;
            }
            .blue_text
            {
                color: #AB47BC;
            }
            .box_size
            {
                height: 12vh;
            }
            .align_box 
            {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .align_text_center 
            {
                text-align: center;
            }
            .m_auto
            {
                margin: auto;
            }
            .no_email 
            {
                text-decoration: none;
            }
            .title_email 
            {
                margin: 0%;
                margin-bottom: 5%;
            }
            a
            {
                color: #AB47BC !important;
            }
            .pt_3
            {
                padding-top: 3%;
            }
            .pb_3
            {
                padding-bottom: 3%;
            }
            .pl_3
            {
                padding-left: 3%;
            }
            .pr_3
            {
                padding-right: 3%;
            }
            .pt_5
            {
                padding-top: 5%;
            }
            .pb_5
            {
                padding-bottom: 5%;
            }
            .btlr-5
            {
                border-top-left-radius: 10px;
            }
            .btrr-5
            {
                border-top-right-radius: 10px;
            }
            .bblr-5
            {
                border-bottom-left-radius: 10px;
            }
            .bbrr-5
            {
                border-bottom-right-radius: 10px;
            }
            .content_email
            {
                width: 50%;
            }
            @media screen and (max-width: 991px)
            {
                .content_email
                {
                    width: 80%;
                }
            }
        </style>
    `
    var html = `
        <html lang="en-ES"> 
            <head>
                <title>Akipartes</title>
                <meta name="description" content=" | " />
                <meta charset="UTF-8" />
                ${style_message}
            </head>
            <body class="gray_background align_box body_email_text pt_3 pb_3">
                <table class="m_auto content_email">
                    <tbody>
                        <tr>
                            <td>
                                <div class="box_size white_background align_box btlr-5 btrr-5 pt_5 pb_5">
                                    <img class="logo m_auto" src="${email_config.general_config_email.img_logo}">
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="white_background align_box pt_5 pb_5 pl_3 pr_3">
                                    <div class="align_text_center m_auto">`
    if (type_email == 'recover_password') {
        html += `
                                        <h2 class="bold blue_text title_email"></h2>
                                        <div class="w-100 black_text ">
                                            ${responses['recover_password_content']} ${data.password}
                                        </div>
                `
    }

    html += ` 
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="box_size black_background align_box bblr-5 bbrr-5 pt_5 pb_5 pl_3 pr_3">
                                    <div class="align_text_center m_auto">
                                        <i class="white_text no_email">${email_config.general_config_email.from_default}</i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
        </html>
        `
    return html
}

module.exports.getTemplate = getTemplate