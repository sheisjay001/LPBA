# LBPA System – Phase 1 & 2 Implementation README

## Purpose
This README defines what must be implemented NEXT to turn the existing LBPA web application into a revenue-ready, decision-driven system.

This phase focuses on:
- Control
- Clarity
- Conversion
- Human + automation balance

No new marketing pages. No redesigns. Only system power.

---

## PHASE 1: SYSTEM CONTROL (NON-NEGOTIABLE)

### 1. Lead State Enforcement
Every lead must exist in exactly ONE state at all times.

Allowed states:
- NEW
- ASSESSMENT_COMPLETED
- NURTURING
- ONLINE_CLIENT
- APPLIED_PHYSICAL
- ACCEPTED
- CLIENT

Rules:
- States can only move forward
- Backend must block invalid jumps
- State changes must be logged with timestamps

Why this exists:
This is the backbone of automation, analytics, and revenue clarity.

---

### 2. Message Template Engine
Messages must not be hardcoded.

Requirements:
- Store templates in database
- Support variables (e.g. {first_name}, {program_name})
- Enable/disable templates without code changes
- Assign templates to lead states

Minimum templates to create:
- Welcome message
- Day 1 value message
- Day 2 value message
- Online program invitation
- Physical application invitation
- Acceptance message

Why this exists:
Messaging will evolve. Code should not.

---

### 3. Automation Pause & Human Handoff
Automation must stop when human attention is required.

Add fields:
- automation_enabled (boolean)
- human_required (boolean)

Automation should pause when:
- User asks about price
- User requests a call
- User mentions physical programs
- Admin manually flags the lead

Only admins can re-enable automation.

Why this exists:
Trust > speed for high-ticket offers.

---

## PHASE 2: REVENUE LOGIC

### 4. Application Scoring System
Physical program applications must be scored, not just read.

Scoring inputs:
- Budget readiness
- Authority level
- Urgency
- Alignment with LBPA values

Scoring output:
- STRONG
- MAYBE
- NOT_READY

Scores should assist decisions, not replace humans.

Why this exists:
Protects premium positioning and saves decision energy.

---

### 5. Payment Gating
High-ticket payments must be gated by approval.

Rules:
- Payment links generated only after acceptance
- Links expire after a defined time
- Payment success auto-updates lead state

Payment types:
- Online program (direct)
- Physical programs (approval-based)

Why this exists:
Exclusivity increases conversion and brand trust.

---

### 6. Funnel Analytics (Minimal, Useful)
Analytics should answer real questions, not impress.

Required metrics:
- Number of leads per state
- Online conversion rate
- Application-to-acceptance ratio
- Monthly revenue

Views:
- Weekly
- Monthly

Why this exists:
You can’t fix what you can’t see.

---

## OPTIONAL (NEXT AFTER THIS PHASE)

- Role-based access (Admin, Reviewer, Support)
- Content source tracking
- Internal notes and reminders

Do NOT add these until Phase 1 and 2 are stable.

---

## IMPLEMENTATION PRIORITY ORDER
1. Lead state enforcement
2. Message template engine
3. Automation pause + human handoff
4. Application scoring
5. Payment gating
6. Funnel analytics

Build in this order.

---

## GUIDING PRINCIPLE
LBPA is a premium academy.

The system must:
- Decide before it sells
- Filter before it accepts
- Support humans, not replace them
- Scale without noise

If a feature does not improve clarity, trust, or conversion, it does not belong here.
