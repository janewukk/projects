from django.contrib import messages

"""
Flash a one-time short message to session
"""
def flash_session_message(request, status, message):

	# convert status to message tag level
	if status == 'success':
		message_level = messages.SUCCESS
	elif status == 'error':
		message_level = messages.ERROR
	elif status == 'warning':
		message_level = messages.WARNING
	else:
		message_level = messages.INFO

	# add message to session
	messages.add_message(request, message_level, message)