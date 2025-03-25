# Contact Form Setup with FormSubmit

This document explains how the contact form works and sends emails to your inbox.

## How It Works

The contact form on the site uses [FormSubmit](https://formsubmit.co/), a simple email service that requires no account creation or setup. It allows you to receive form submissions directly to your email address (hp040912@gmail.com).

## First-Time Activation

**Important:** The first time someone submits the contact form:

1. FormSubmit will send a confirmation email to hp040912@gmail.com
2. You must click the activation link in that email
3. After this one-time confirmation, all future form submissions will be automatically forwarded to your email

## What's Already Set Up

The contact form is already configured with:

1. The form action pointing to `https://formsubmit.co/hp040912@gmail.com`
2. Hidden fields for controlling how FormSubmit works:
   - `_captcha: false` - Disables the captcha challenge
   - `_subject` - Sets the email subject with the user's subject
   - `_next` - Redirects the user back to the contact page after submission

## Testing the Form

1. Go to the Contact page on your website
2. Fill out the form and submit it
3. Look for a confirmation email from FormSubmit in your inbox (hp040912@gmail.com)
4. Click the activation link
5. Test the form again - this submission should arrive directly in your inbox

## Customizing FormSubmit Behavior

If you want to modify how FormSubmit works:

1. **Enable CAPTCHA**: Change `_captcha` value to `true` to reduce spam
2. **Custom Redirect**: Change the `_next` URL to a different thank-you page
3. **CC/BCC Others**: Add additional hidden fields:
   ```html
   <input type="hidden" name="_cc" value="another@email.com" />
   ```

## Troubleshooting

- **Not receiving emails?** Check your spam folder
- **Form not working?** Make sure you've clicked the activation link in the FormSubmit confirmation email
- **Need more help?** Visit [FormSubmit's documentation](https://formsubmit.co/) for additional information 