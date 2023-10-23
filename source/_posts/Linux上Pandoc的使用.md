---
title: Linux上Pandoc的使用
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/QQ%E6%88%AA%E5%9B%BE20230819015436.png'
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'Linux,安装,centos'
categories:
  - Linux
tags:
  - Linux
  - Pandoc
  - 软件安装
swiper_index: 3
abbrlink: 557acb69
date: 2023-08-09 18:25:15
---

{% note info simple %}如果你需要在不同的文件格式之间相互转换，多半听说或使用过文档转换的瑞士军刀——Pandoc。事实上，不仅人类知道 Pandoc，最近很火的人工智能 ChatGPT 也知道「将 Markdown 转换为 docx」，首选方案是使用 Pandoc。{% endnote %}
{% link Pandoc 官网, https://www.pandoc.org/, https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/%E8%B7%AF%E5%BE%84.svg %}


## 1 安装
- 下载压缩包
```BASH
wget https://github.com/jgm/pandoc/releases/download/2.14.0.3/pandoc-2.14.0.3-linux-amd64.tar.gz
```

- 解压
```BASH
tar -xvf pandoc-2.14.0.3-linux-amd64.tar.gz
```

- 建立软链接
```BASH
ln -s /root/pandoc-2.14.0.3/bin/pandoc /usr/bin/pandoc
```

- latex引擎安装
```BASH
yum install texlive-xetex
```

- 查看版本
```BASH
pandoc -v 
```

## 2 使用
{% tip success %}To see the output created by each of the commands below, click on the name of the output file:
{% endtip %}

- HTML fragment
```BASH
pandoc MANUAL.txt -o example1.html
```

- Standalone HTML file
```BASH
pandoc -s MANUAL.txt -o example2.html
```

- HTML with table of contents, CSS, and custom footer
```BASH
pandoc -s --toc -c pandoc.css -A footer.html MANUAL.txt -o example3.html
```
- LaTeX
```BASH
pandoc -s MANUAL.txt -o example4.tex
```
- From LaTeX to markdown
```BASH
pandoc -s example4.tex -o example5.text
```
- reStructuredText
```BASH
pandoc -s -t rst --toc MANUAL.txt -o example6.text
```
- Rich text format (RTF)
```BASH
pandoc -s MANUAL.txt -o example7.rtf
```
- Beamer slide show
```BASH
pandoc -t beamer SLIDES -o example8.pdf
```
- DocBook XML
```BASH
pandoc -s -t docbook MANUAL.txt -o example9.db
```
- Man page
```BASH
pandoc -s -t man pandoc.1.md -o example10.1
```
- ConTeXt
```BASH
pandoc -s -t context MANUAL.txt -o example11.tex
```
- Converting a web page to markdown
```BASH
pandoc -s -r html http://www.gnu.org/software/make/ -o example12.text
```
- From markdown to PDF
```BASH
pandoc MANUAL.txt --pdf-engine=xelatex -o example13.pdf
```
- PDF with numbered sections and a custom LaTeX header
```BASH
pandoc -N --variable "geometry=margin=1.2in" --variable mainfont="Palatino" --variable sansfont="Helvetica" --variable monofont="Menlo" --variable fontsize=12pt --variable version=2.0 MANUAL.txt --include-in-header fancyheaders.tex --pdf-engine=lualatex --toc -o example14.pdf
```
- ipynb (Jupyter notebook)
```BASH
pandoc example15.md -o example15.ipynb
```
- HTML slide shows
```BASH
pandoc -s --mathml -i -t dzslides SLIDES -o example16a.html

pandoc -s --webtex -i -t slidy SLIDES -o example16b.html

pandoc -s --mathjax -i -t revealjs SLIDES -o example16d.html
```
- TeX math in HTML
```BASH
pandoc math.text -s -o mathDefault.html

pandoc math.text -s --mathml  -o mathMathML.html

pandoc math.text -s --webtex  -o mathWebTeX.html

pandoc math.text -s --mathjax -o mathMathJax.html

pandoc math.text -s --katex   -o mathKaTeX.html
```
- Syntax highlighting of delimited code blocks
```BASH
pandoc code.text -s --highlight-style pygments -o example18a.html

pandoc code.text -s --highlight-style kate -o example18b.html

pandoc code.text -s --highlight-style monochrome -o example18c.html

pandoc code.text -s --highlight-style espresso -o example18d.html

pandoc code.text -s --highlight-style haddock -o example18e.html

pandoc code.text -s --highlight-style tango -o example18f.html

pandoc code.text -s --highlight-style zenburn -o example18g.html
```
- GNU Texinfo
```BASH
pandoc MANUAL.txt -s -o example19.texi
```
- OpenDocument XML
```BASH
pandoc MANUAL.txt -s -t opendocument -o example20.xml
```
- ODT (OpenDocument Text, readable by OpenOffice)
```BASH
pandoc MANUAL.txt -o example21.odt
```
- MediaWiki markup
```BASH
pandoc -s -t mediawiki --toc MANUAL.txt -o example22.wiki
```
- EPUB ebook
```BASH
pandoc MANUAL.txt -o MANUAL.epub
```
- Markdown citations
```BASH
pandoc -s --bibliography biblio.bib --citeproc CITATIONS -o example24a.html

pandoc -s --bibliography biblio.json --citeproc --csl chicago-fullnote-bibliography.csl CITATIONS -o example24b.html

pandoc -s --bibliography biblio.yaml --citeproc --csl ieee.csl CITATIONS -t man -o example24c.1
```
- Textile writer
```BASH
pandoc -s MANUAL.txt -t textile -o example25.textile
```
- Textile reader
```BASH
pandoc -s example25.textile -f textile -t html -o example26.html
```
- Org-mode
```BASH
pandoc -s MANUAL.txt -o example27.org
```
- AsciiDoc
```BASH
pandoc -s MANUAL.txt -t asciidoc -o example28.txt
```
- Word docx
```BASH
pandoc -s MANUAL.txt -o example29.docx
```
- LaTeX math to docx
```BASH
pandoc -s math.tex -o example30.docx
```
- DocBook to markdown
```BASH
pandoc -f docbook -t markdown -s howto.xml -o example31.text
```
- MediaWiki to html5
```BASH
pandoc -f mediawiki -t html5 -s haskell.wiki -o example32.html
```
- Chunked HTML
```BASH
pandoc -t chunkedhtml --split-level=2 --toc --toc-depth=2 --number-sections -o example33 MANUAL.txt
```
- Docx with a reference docx
```BASH
pandoc --reference-doc twocolumns.docx -o UsersGuide.docx MANUAL.txt
```
- Docx to markdown, including math
```BASH
pandoc -s example30.docx -t markdown -o example35.md
```
- EPUB to plain text
```BASH
pandoc MANUAL.epub -t plain -o example36.text
```
- Using a template to produce a table from structured data
```BASH
pandoc fishwatch.yaml -t rst --template fishtable.rst -o fish.rst # see also the partial species.rst
```
- Converting a bibliography from BibTeX to CSL JSON
```BASH
pandoc biblio.bib -t csljson -o biblio2.json
```
- Producing a formatted version of a bibliography
```BASH
pandoc biblio.bib --citeproc --csl ieee.csl -s -o biblio.html
```

## 3 中文乱码问题

中文乱码问题，大多与字体有关，解决方案详见文章
{% link Linux 系统字体安装, https://tankenqi.cn/posts/2de821dc/, https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/20201027105140931.png %}

