import os, json
import pandas as pd
from dotenv import load_dotenv
import openai

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=origins,
    allow_headers=origins,
)


class UserQuestion(BaseModel):
    content: str


class AIAnswer(BaseModel):
    question_content: str
    answer_content: str


load_dotenv()
openai.api_key = os.environ["OPENAI_API_KEY"]

DEFAULT_TEMPLATE = (
""" 
    The following is a friendly conversation between a human and an AI, The AI is capable of \
    answering the human's queries and is also not afraid to tell the user that it has no idea \
    nor information pertaining to a question / query it is not familiar with. The AI also
    gives suggestions to the user to reference external sources if it not aware of a \
    particular human query.

    The AI can follow the conversational context below to further understand the format of the \
    conversations:

    Context:
    Human: Good day, how are you

    AI: I am good today, how may I be of assistance to you?

    ...

    The AI then continue the conversation based on the current conversation as shown
    Current conversation:
    {history}
    Human: {input}
    AI:
""")


@app.get("/")
async def get_hello():
    return "Welcome to our openAI"


@app.post("/question/")
async def post_question(item: UserQuestion):
    response = openai.ChatCompletion.create(
        model=os.environ["PRETRAINED_MODEL_NAME"],
        messages=[
            {"role": "user", "content": item.content}
        ]
    )

    result = ''
    for choice in response.choices:
        result += choice.message.content

    print(result)

    if result != '':
        return {"status": 200, "data": result}
    else:
        return {"status": 401}