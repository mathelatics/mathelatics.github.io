---
title: "NextQuestAI: Deep Research Multi-Agent System"
cover: "/images/projects/NextQuestAI/1778063175230.png"
category: "AI Systems"
url: "https://github.com/ajeetkbhardwaj/NextQuestAI"
tags: ["ai-systems", "multi-agent", "langgraph", "nim", "deep-research", "llm"]
excerpt: "NextQuestAI is a high-performance, multi-agent research orchestrator powered by LangGraph and NVIDIA NIM. <br/><img src='/images/projects/NextQuestAI/1778063175230.png' alt='NextQuestAI Architecture'/>"
---

## Overview

NextQuestAI is an autonomous deep-research orchestrator. Given a research question, a team of agents plans the investigation, retrieves and reads sources, synthesizes findings, and writes up a research report — all coordinated through a LangGraph state machine with NVIDIA NIM inference backends.

## What I built

- **Orchestration:** LangGraph-based multi-agent workflow with planner, researcher, reader, and writer agents sharing a persistent state.
- **Inference:** NVIDIA NIM endpoints serving the LLMs behind each agent.
- **Research loop:** agents break questions into sub-queries, fetch sources, extract evidence, and iterate until the answer is sufficiently supported.
- **Reporting:** an auto-generated report summarizing findings with citations.

## Outcome

NextQuestAI shows how agentic research assistants can reduce the manual effort of literature review and synthesis, while remaining controllable through the explicit graph structure of the agent workflow.
