# ram81.github.io

For more details, visit <a href="http://ram81.github.io">http://ram81.github.io</a>

## How to run locally

### Docker

Run using Docker:

```
docker run --rm -it -p 4000:4000 -v "$PWD:/srv/jekyll" jekyll/jekyll jekyll serve --watch --host "0.0.0.0" --config _config.yml,_config.dev.yml
```