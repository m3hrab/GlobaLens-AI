# Roadmap

Notes on what's left to turn this from a hackathon prototype into something I'd actually be comfortable pointing people to. Corresponding issues are in [`ISSUES.md`](ISSUES.md).

## First: just clean the repo up

Before touching any code, the repo itself needs a pass. There's a duplicate `readme.md` sitting next to `README.md` (different case, same name — that's asking for trouble on case-sensitive filesystems), a `judging_criteria.md` and an overview HTML file that were only ever meant for the hackathon judges, and a handful of loose scripts at the backend root (`run.py`, `start.sh`, `check_query_status.py`, etc.) that I'm honestly not sure I still need. None of this is hard, it just hasn't been done, and it's the difference between a repo that looks maintained and one that looks abandoned since October.

Same goes for having two `docker-compose.yml` files — one at root, one in `backend/`. If there's a reason for both, I should write it down; if not, one goes.

## The tests aren't really tests

`backend/` has a pile of `test_*.py` files at the root — `test_api.py`, `test_backend_full.py`, `test_complete_workflow.py`, `test_fixed_workflow.py`, and a few more. Looking back at them, these were exploration scripts I ran manually while building the thing, not an actual suite. A few of them cover the same ground with slightly different names, which is a sign I was debugging rather than testing.

Worth doing properly: move everything into `backend/tests/`, write it as pytest with real fixtures (test client, test DB, mocked LLM calls so tests don't burn API credits), and split by concern instead of by workflow. This also has to happen before CI is worth setting up — there's no point linting and running tests on every PR if the "tests" are scripts that print stuff and don't assert anything.

## Config

`core/config.py` should read settings from environment variables via pydantic, if it doesn't fully already. Either way, I should add a `.env.example` for both backend and frontend — right now anyone cloning this has to guess which env vars exist by reading the code.

## What I'm not changing

The backend layering (routes call services, services touch models, schemas handle validation) held up fine and I don't think it needs a rewrite. Same for the frontend — app-router pages plus components/contexts/hooks/types is a normal shape for a project this size. The parts that need work are more about finishing things and cleaning up debt than restructuring what's already there.

## The agent layer is the one thing worth re-architecting

Right now most of the agent logic lives in one file, `agent_service.py`. As the move from SmythOS to LangGraph happens, it makes sense to give agents their own package instead:

```
backend/app/agents/
├── graph.py          # builds/compiles the graph
├── state.py          # state passed between nodes
└── nodes/
    ├── risk_monitor.py
    └── action_plan.py
```

That makes each node testable on its own, and means adding a third agent later doesn't mean growing one file indefinitely.

On background jobs — FastAPI's `BackgroundTasks` is fine for now. It's not durable (a restart mid-job loses that job), but I don't think that's worth solving with Celery or a real queue until there's actual concurrent traffic to justify it.

## Things that would make it feel like a real project instead of a demo

- CI that runs lint + the new test suite on every PR
- A CONTRIBUTING.md (folding in what's currently DEVELOPMENT.md)
- A CHANGELOG once I start tagging versions
- Deciding what the `settings` page in the frontend is actually for — it exists as a page right now but doesn't do much
- One documented way to run the whole thing. Right now there's `run.py`, `start.sh`, `start-dev.sh`, and docker-compose all doing overlapping jobs; picking one and deleting the rest would save a future contributor (or me, in six months) a lot of guessing.

## Rough order I'd do this in

Cleanup first since it's low-risk and immediately makes the repo look active. Then the agent restructure, since the test suite should be written against the structure that's actually staying, not the one being replaced. Then CI. Then the product gaps (analytics view, streaming progress). Deployment is last — Render, Fly.io, or Railway are all simple enough for something this size; no need for anything Kubernetes-shaped.
