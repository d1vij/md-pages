# Title

> [!NOTE] Admonition Title  
> This is a note admonition line 1.  
> This is a second line.  
> 2This is a line starting with a number.  
> 23123This is a long numeric prefix test.  
> This is 1asdsa note admonition.  
> **BOLD INSIDE ADMONITION**  
> *italic inside admonition*  
> `inline code` inside admonition  
> normal line continues  
>
> - list item inside admonition  
> - another list item  
>
> > nested blockquote inside admonition  
> > still part of the admonition  
>
> ```
> fenced code block in admonition
> second line
> ```
>
> [link inside admonition](https://example.com)

paragraph after admonition

---

## Additional Tests

### Warning Admonition

> [!WARNING] This is a Warning  
> The system is approaching limits.  
> **Act quickly.**  
> More description here.  

Normal paragraph.

---

### Tip Admonition

> [!TIP] Quick Tip  
> Remember to hydrate!  
> Use *italic*, **bold**, and `code`.

---

### Nested Admonition Test

> [!INFO] Parent Admonition  
> Parent line 1  
> Parent line 2  
>
> > [!NOTE] Nested Child Admonition  
> > Child line A  
> > Child line B  
>
> Parent line 3

After nested admonition.

---

### Admonition with interrupted block

> [!CAUTION] Broken Block  
> Line 1 inside  
> Line 2 inside  
This line breaks the admonition.
> This MUST NOT be inside the admonition.

---

### Multiple Admonitions Back-to-Back

> [!INFO] First Box  
> content A

> [!WARNING] Second Box  
> content B

> [!ERROR] Third Box  
> content C

---

### Edge Case: Empty admonition

> [!NOTE] Empty Box  
>

Paragraph after empty box.

---

END OF TEST
