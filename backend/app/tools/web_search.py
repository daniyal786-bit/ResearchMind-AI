from tavily import TavilyClient
import time

from app.config import TAVILY_API_KEY


tavily_client = TavilyClient(
    api_key=TAVILY_API_KEY
)


def search_web(query: str, max_results: int = 3):

    last_error = None

    for attempt in range(2):

        try:
            response = tavily_client.search(
                query=query,
                search_depth="basic",
                max_results=max_results
            )

            results = []

            for result in response.get("results", []):

                content = result.get("content", "")

                # Limit text sent to the LLM
                content = content[:1500]

                results.append({
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "content": content
                })

            return results

        except Exception as error:

            last_error = error

            if attempt == 0:
                time.sleep(2)

    raise last_error