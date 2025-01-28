from django.utils import timezone

class MessageManager:
    MESSAGES = {
        'registration': {
            'title': 'Registration Successful!',
            'message': 'You have successfully created a new process flow account',
            'description': ''
        },
        'login': {
            'title': 'Account Login',
            'message': 'New login session initiated on your process flow account',
            'description': "A new login session was successfully initiated on your account.\nDate and Time :  {date};    {time}\n"

        },
        'password_changed': {
            'title': 'Password Changed',
            'message': 'Your process flow password was successfully changed.',
            'description': ''
        },
    }

    @classmethod
    def get_message(cls, message_type, **kwargs):
        message_data = cls.MESSAGES.get(message_type, {})
        title = message_data.get('title', '')
        message = message_data.get('message', '').format(**kwargs)
        description = message_data.get('description', '')
        
        # Format description based on message type and provided parameters
        if message_type == 'login':
            current_time = timezone.now()
            login_date = kwargs.get('login_date', current_time.strftime('%Y-%m-%d'))
            login_time = kwargs.get('login_time', current_time.strftime('%H:%M %Z'))
            description = description.format(time=login_time, date=login_date)
            
        return title, message, description
