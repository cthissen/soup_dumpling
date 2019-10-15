FROM python:3.6-slim-stretch

RUN apt update
RUN apt install -y python3-dev gcc git

# Install pytorch and fastai
RUN pip install torch_nightly -f https://download.pytorch.org/whl/nightly/cpu/torch_nightly.html
#RUN pip install fastai
RUN git clone https://github.com/fastai/fastai
WORKDIR fastai
RUN tools/run-after-git-clone
RUN pip install -e ".[dev]"
WORKDIR /

# Install starlette and uvicorn
RUN pip install starlette uvicorn python-multipart aiohttp

#ADD cougar.py cougar.py
#ADD usa-inaturalist-cats.pth usa-inaturalist-cats.pth
#ADD export.pkl export.pkl

# ADD soup_dumpling.py soup_dumpling.py
# Run it once to trigger resnet download
RUN pip install flask
ADD flask_soup_dumpling.py flask_soup_dumpling.py
ADD templates templates
ADD static static
#RUN python flask_soup_dumpling.py

EXPOSE 8008

# Start the server
CMD ["python", "flask_soup_dumpling.py", "serve"]
