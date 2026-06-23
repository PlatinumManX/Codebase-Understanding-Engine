from flask import Flask

app = Flask(__name__)

@app.route("/login",methods=["POST"])
def login():
    pass

@app.route("/register",methods=["POST"])
def register():
    pass