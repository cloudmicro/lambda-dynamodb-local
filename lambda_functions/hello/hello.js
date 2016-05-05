'use strict';
console.log('Loading function');

exports.hello_handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('first name =', event.first_name);
    console.log('last name =', event.last_name);
    //callback(null, event.key1);  // Echo back the first key value
    // callback('Something went wrong');

    context.done(null, 'great!');
};