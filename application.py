from flask import Flask

from rand import random_melee_char


# print a nice greeting.
def random_char():
    char = random_melee_char()
    return f'<p>{char}</p>\n'

# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>Random Melee Character</title> </head>\n<body><h1 align="center">'''
footer_text = '</h1></body>\n</html>'

# EB looks for an 'application' callable by default.
application = Flask(__name__)

# add a rule for the index page.
application.add_url_rule('/', 'index', (lambda: header_text +
    random_char() + footer_text))

# # add a rule when the page is accessed with a name appended to the site
# # URL.
# application.add_url_rule('/<username>', 'hello', (lambda username:
#     header_text + say_hello(username) + home_link + footer_text))

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    #application.debug = True
    application.run()