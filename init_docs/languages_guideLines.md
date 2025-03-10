# BeLL Apps languages_guideLines.md

## About
BeLL Apps is offering multi-Lingual interface. For this purpose, it uses some documents that consist of **KEYS** that represent the literals against which we are going to provide their corresponding _translations_ in the form of **VALUES**. This document intends to provide guidelines to make legal changes in order to make fruitful additions in any particular language file.

##Guidelines
To successfully update any particular language's document located in [BeLL-Apps/init_docs](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/init_docs) follow the below mentioned guidelines.

1) All of the keys and corresponding values (translations) are going to be surrounded by inverted commas.
     ![Use Commas](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic1.png)

2) Make sure that each key and value pair is separated by a colon.
     ![Use Colon](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic2.png)

3) Watch out for the commas.
     ![Watch Out for Commas](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic3.png)

4) In order, to separate more than one records, again use single comma.
     ![Use Comma](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic4.png)

5) While updating the document for language, please make sure that the nameOfLanguage attribute is not written in any native/local language. We assume that the **nameOfLanguage** attribute is always going to be in **English**
     ![nameOfLanguage Attribute](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic5.png)

6) Also, keep the numbers to be in Cardinal form used in English. Avoid changing numbers in particular language's native style.
      ![Use Cardinal Numbers](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic6.png)

7) In case of replacement of literals please make sure that you only replace the translations and don't change the formatting otherwise, it will result in an illegal JSON object.

8) Don't miss the brackets. If there is one opening then their ought to be one ending as well as soon as the scope that object ends.
      ![Watch Out for Brackets](https://github.com/open-learning-exchange/BeLL-Apps/tree/dev/images/pic7.png)