
# User

***반환이나 계산은 모두 (초) 단위*** 

**현재 랭킹은 max_time 기준으로 정렬**

## POST: /user/register
> Require
	
	name: String
  	facebookId: String
  	profileURL: String
	
> Response: Success

	userModel: 하단 예시 참고

> Response: Fail

	message: "Facebook Id is already existed"


## POST: /user/ranking
> Require
	
> Response: Success
  
  	정렬된 모델( 하단의 예시 참고 )

## POST: /user/friend/ranking
> Require
	
	ids: String
	
	
  	1003922,29239328,23329
  	쉼표로 아이디를 구분합니다.
	
> Response: Success
  
  /user/ranking 참고

## POST: /user/start
> Require
	
	token: String
  	current: String
	현재 공부하고 있는 것
		
> Response: Success

  	amount: Number
	현재 시간 - 마지막으로 공부를 마친 시간
	
  	message: "초만에 시작하는 공부"

> Response: Fail

	message: "Wrong Token"
  
> 공부를 시작하면 end_time이 -1로 설정됨.

## POST: /user/end
> Require

	token: String
	
> Response: Success

  	amount: Number
	공부량

> Response: Fail

	message: "Wrong Token"
  
> 공부를 마치면 start_time이 -1로 설정됨.

## POST: /user/updateAverageTime
> Require

	token: String
  	average_time: Number
	
> Response: Success

  	message: "success"
  	result: (ignorable)

> Response: Fail

	message: "Wrong Token"
  
## POST: /user/updateMaxTime
> Require

	token: String
  	max_time: Number
	
> Response: Success

  	message: "success"
  	result: (ignorable)  

> Response: Fail
	
	message: "Wrong Token"
  

### 랭킹 예시
<pre><code>
[
    {
        "_id": "5d00f5fbe6b03d31a565d474",
        "name": "삼창현",
        "facebookId": "231",
        "profileURL": "http://",
        "current": "",
        "start_time": -1,
        "end_time": 1560344276408,
        "average_time": 0,
        "max_time": 20.901,
        "token": "B18ceNyM97hR0bwDTrts0B9cWgzyZvIx",
        "__v": 0
    },
    {
        "_id": "5d00f5f6e6b03d31a565d473",
        "name": "이창현",
        "facebookId": "123",
        "profileURL": "http://",
        "current": "",
        "start_time": -1,
        "end_time": 1560344086756,
        "average_time": 0,
        "max_time": 4.115,
        "token": "cSPNmcY4QN1TrCuxT8bv4zEgM23gAiqt",
        "__v": 0
    }
]
</code></pre>
