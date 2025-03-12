
## GET    /api/messages-from-sender/{sender_id}

ex: ```http://localhost:8000/api/messages-from-sender/6```

Header: 
```json 
"Authorization":"Bearer 2|E2TTrhc3vyBI5wuGIclSvPjocip3RsNkXU4hIIp5d183416f"
```


```json
{
    "current_page": 1,
    "data": [],
    "first_page_url": "http:\/\/localhost:8000\/api\/messages-from-sender\/6?page=1",
    "from": null,
    "last_page": 1,
    "last_page_url": "http:\/\/localhost:8000\/api\/messages-from-sender\/6?page=1",
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "http:\/\/localhost:8000\/api\/messages-from-sender\/6?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": null,
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "next_page_url": null,
    "path": "http:\/\/localhost:8000\/api\/messages-from-sender\/6",
    "per_page": 10,
    "prev_page_url": null,
    "to": null,
    "total": 0
}
```

##

ex:```http://localhost:8000/api/SendTo/6 ```
Header: 
```json 
"Authorization":"Bearer 2|E2TTrhc3vyBI5wuGIclSvPjocip3RsNkXU4hIIp5d183416f"
```
Body:
```json 
{
    "message":"hello"
}
```