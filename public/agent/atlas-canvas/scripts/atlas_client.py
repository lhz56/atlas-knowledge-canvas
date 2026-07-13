#!/usr/bin/env python3
"""Small dependency-free client for the Atlas workspace API."""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def credentials():
    endpoint = os.environ.get("ATLAS_ENDPOINT", "").rstrip("/")
    token = os.environ.get("ATLAS_TOKEN", "")
    if not endpoint or not token:
        raise SystemExit("Set ATLAS_ENDPOINT and ATLAS_TOKEN before using Atlas.")
    return endpoint, token


def request(method, payload=None, agent="Atlas skill"):
    endpoint, token = credentials()
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(
        endpoint,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "X-Atlas-Agent": agent,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        detail = error.read().decode(errors="replace")
        raise SystemExit(f"Atlas returned HTTP {error.code}: {detail}") from error


def main():
    parser = argparse.ArgumentParser(description="Inspect or update an Atlas canvas")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("inspect")
    bootstrap = sub.add_parser("bootstrap")
    bootstrap.add_argument("workspace", help="JSON file containing a new workspace object")
    transact = sub.add_parser("transact")
    transact.add_argument("operations", help="JSON file containing an operation array")
    transact.add_argument("--agent", default="Atlas skill")
    args = parser.parse_args()

    if args.command == "inspect":
        result = request("GET")
    elif args.command == "bootstrap":
        with open(args.workspace, encoding="utf-8") as file:
            workspace = json.load(file)
        if not isinstance(workspace, dict) or not isinstance(workspace.get("canvases"), list):
            raise SystemExit("Workspace file must contain an object with a canvases array.")
        result = request("POST", {"action": "bootstrap", "workspace": workspace})
    else:
        with open(args.operations, encoding="utf-8") as file:
            operations = json.load(file)
        if not isinstance(operations, list):
            raise SystemExit("Transaction file must contain a JSON array.")
        result = request("POST", {"agent": args.agent, "operations": operations}, args.agent)
    json.dump(result, sys.stdout, indent=2, ensure_ascii=False)
    print()


if __name__ == "__main__":
    main()
