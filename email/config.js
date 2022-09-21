export const emailTemplate = {};

let subject = `Message recieved from ${name}!`;
let content = `<HTML>
        <body>
            Name: ${name}
            Email: ${email}
            Recieved on: ${entry_date}
            <br>
            Message: ${message}
        </body>
    </HTML>`;
