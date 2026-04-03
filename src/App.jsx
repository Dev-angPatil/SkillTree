import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const onboardingSteps = [
  {
    id: 'interests',
    title: 'Pick your interests',
    subtitle: 'Shape your first learning route',
    type: 'multi',
    options: ['Frontend', 'Python', 'Design', 'AI Basics', 'Data', 'Mobile'],
  },
  {
    id: 'goal',
    title: 'What are you optimizing for?',
    subtitle: 'We will tune the journey mood to match',
    type: 'single',
    options: ['Career', 'Hobby'],
  },
  {
    id: 'level',
    title: 'Choose your starting level',
    subtitle: 'Keep it simple and grow momentum',
    type: 'single',
    options: ['Beginner', 'Intermediate'],
  },
]

const courses = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Build interactive sites, responsive layouts, and polished UI flows.',
    duration: '4 weeks',
    accent: 'from-indigo-500/30 to-cyan-400/10',
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Learn scripting, automation, and practical problem solving fast.',
    duration: '4 weeks',
    accent: 'from-emerald-500/25 to-lime-400/10',
  },
  {
    id: 'uiux',
    title: 'UI/UX',
    description: 'Craft clean interfaces, strong flows, and user-first product thinking.',
    duration: '4 weeks',
    accent: 'from-amber-400/25 to-rose-400/10',
  },
]

// FIX 1: Redesigned node positions for a clean left-to-right S-curve flow.
// Previous positions had the Checkpoint node at x=820 which bled out of the
// container (~850px wide), and y-values were scattered with no visual rhythm.
// New layout creates a wave: low → high → low → high, keeping all nodes
// well within bounds with comfortable padding from edges.
const webJourneyNodes = [
  {
    id: 1,
    title: 'HTML Basics',
    kind: 'main',
    x: 90,
    y: 300,
    description: 'Start with the language that gives every page its structure.',
  },
  {
    id: 201,
    title: 'Mini Quest',
    kind: 'side',
    x: 370,
    y: 430,
    description: 'Optional side challenge: skim a small branch of extra HTML context.',
  },
  {
    id: 2,
    title: 'Tags',
    kind: 'main',
    x: 290,
    y: 140,
    description: 'Learn the tags that shape real content and semantic layout.',
  },
  {
    id: 3,
    title: 'Forms',
    kind: 'main',
    x: 530,
    y: 300,
    description: 'Collect user input and build interactive flows.',
  },
  {
    id: 4,
    title: 'Checkpoint',
    kind: 'checkpoint',
    x: 750,
    y: 140,
    description: 'Lock in your progress and unlock the next region.',
  },
]

const mainNodeOrder = [1, 2, 3, 4]
const quizQuestions = [
  {
    prompt: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyperlink Text Machine Language',
    ],
  },
  {
    prompt: 'Which tag is used for a paragraph?',
    options: ['<div>', '<p>', '<span>'],
  },
]

const orbitBadges = [
  { label: 'Focus +12', tone: 'text-cyan-200', position: 'left-[10%] top-[22%]' },
  { label: 'Streak Live', tone: 'text-emerald-200', position: 'right-[12%] top-[18%]' },
  { label: 'XP Boost', tone: 'text-amber-200', position: 'left-[14%] bottom-[20%]' },
]

const skillGraphNodes = [
  { id: 'web', label: 'Web Development', short: 'WD', x: 50, y: 16, state: 'core', description: 'Your main track and parent node for the whole front-end route.' },
  { id: 'html', label: 'HTML', short: 'HT', x: 24, y: 36, state: 'active', description: 'The current active branch. HTML unlocks structure, semantics, and the first quests.' },
  { id: 'css', label: 'CSS', short: 'CS', x: 50, y: 42, state: 'future', description: 'Future branch for styling, layout systems, and interface polish.' },
  { id: 'js', label: 'JavaScript', short: 'JS', x: 76, y: 36, state: 'future', description: 'Future branch for interaction, logic, and dynamic behavior.' },
  { id: 'tags', label: 'Tags', short: 'TG', x: 14, y: 70, state: 'child', description: 'Child node of HTML focused on semantic elements and content structure.' },
  { id: 'forms', label: 'Forms', short: 'FM', x: 34, y: 76, state: 'child', description: 'Child node of HTML focused on user input and interaction patterns.' },
  { id: 'flexbox', label: 'Flexbox', short: 'FX', x: 50, y: 74, state: 'future', description: 'CSS child node for responsive alignment and spatial control.' },
  { id: 'basics', label: 'Basics', short: 'BS', x: 76, y: 72, state: 'future', description: 'JavaScript child node for variables, conditions, and flow.' },
]

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: 'easeIn' } },
}

const optionButtonBase =
  'rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60'

const webCourse = courses[0]

function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding')
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [selectedInterests, setSelectedInterests] = useState(['Frontend', 'Design'])
  const [selectedGoal, setSelectedGoal] = useState('Career')
  const [selectedLevel, setSelectedLevel] = useState('Beginner')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const [showNodeCard, setShowNodeCard] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [showSkillTree, setShowSkillTree] = useState(false)
  const [selectedSkillNode, setSelectedSkillNode] = useState('html')
  const [focusedNodeId, setFocusedNodeId] = useState(mainNodeOrder[0])
  const [completionFlashNodeId, setCompletionFlashNodeId] = useState(null)

  const activeStep = onboardingSteps[onboardingStep]
  const activeMainNodeId = mainNodeOrder[currentNodeIndex]
  const focusedNodeIdSafe = focusedNodeId ?? activeMainNodeId
  const focusedNode = webJourneyNodes.find((node) => node.id === focusedNodeIdSafe) ?? webJourneyNodes[0]
  const activeNode = webJourneyNodes.find((node) => node.id === activeMainNodeId) ?? webJourneyNodes[0]
  const checkpointNode = webJourneyNodes.find((node) => node.kind === 'checkpoint') ?? webJourneyNodes[webJourneyNodes.length - 1]
  const completedCount = currentNodeIndex
  const journeyProgress = Math.min((completedCount / (mainNodeOrder.length - 1)) * 100, 100)
  const checkpointDistance = Math.max(mainNodeOrder.length - 1 - currentNodeIndex, 0)
  const level = 3 + Math.floor(currentNodeIndex / 2)
  const xp = Math.min(36 + currentNodeIndex * 24 + (quizAnswered ? 12 : 0), 100)
  const streak = 4 + currentNodeIndex
  const energy = Math.min(70 + currentNodeIndex * 8, 100)
  const canContinue =
    activeStep.id === 'interests'
      ? selectedInterests.length > 0
      : activeStep.id === 'goal'
        ? Boolean(selectedGoal)
        : Boolean(selectedLevel)

  const usingWebJourney = (selectedCourse?.id ?? webCourse.id) === 'web-dev'

  const progressLabel = useMemo(() => {
    if (currentNodeIndex >= mainNodeOrder.length - 1) {
      return 'Checkpoint reached'
    }
    return `Next goal: Reach ${checkpointNode.title}`
  }, [checkpointNode.title, currentNodeIndex])

  const cameraTarget = useMemo(() => {
    if (!focusedNode) {
      return { x: 0, y: 0, scale: 1 }
    }

    const baseScale = showVideoModal || showNodeCard ? 1.22 : 1
    return {
      x: 240 - focusedNode.x * (baseScale - 1),
      y: 40 - focusedNode.y * (baseScale - 1) * 0.35,
      scale: baseScale,
    }
  }, [focusedNode, showNodeCard, showVideoModal])

  const isNodeUnlocked = (nodeId) => {
    const orderIndex = mainNodeOrder.indexOf(nodeId)
    if (orderIndex >= 0) {
      return orderIndex <= currentNodeIndex
    }
    // FIX 2 (minor): the original had `nodeId === 201 ? 1 : 1` — both
    // branches returned 1, making the ternary pointless. Left as-is since
    // there's only one side node, but worth noting if you add more side nodes.
    const parentOrderIndex = 1
    return parentOrderIndex <= currentNodeIndex
  }

  const isNodeCompleted = (nodeId) => {
    const orderIndex = mainNodeOrder.indexOf(nodeId)
    if (orderIndex >= 0) {
      return orderIndex < currentNodeIndex
    }
    const parentOrderIndex = 1
    return parentOrderIndex < currentNodeIndex
  }

  const isNodeCurrent = (nodeId) => nodeId === activeMainNodeId

  const handleOptionToggle = (stepId, option) => {
    if (stepId === 'interests') {
      setSelectedInterests((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
      )
      return
    }

    if (stepId === 'goal') {
      setSelectedGoal((prev) => (prev === option ? '' : option))
      return
    }

    setSelectedLevel((prev) => (prev === option ? '' : option))
  }

  const handleContinue = () => {
    if (!canContinue) {
      return
    }

    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep((prev) => prev + 1)
      return
    }

    setCurrentScreen('courses')
  }

  const handleCourseSelect = (course) => {
    setSelectedCourse(course)
    setCurrentNodeIndex(0)
    setFocusedNodeId(mainNodeOrder[0])
    setShowNodeCard(false)
    setShowVideoModal(false)
    setVideoCompleted(false)
    setQuizAnswered(false)
    setSelectedAnswers({})
    setCurrentQuestionIndex(0)
    setSelectedOption('')
    setCurrentScreen('journey')
  }

  const handleNodeFocus = (node) => {
    setFocusedNodeId(node.id)

    if (node.kind !== 'main' && node.kind !== 'checkpoint') {
      return
    }

    if (!isNodeCurrent(node.id)) {
      return
    }

    if (node.id === 1) {
      setVideoCompleted(false)
      setShowVideoModal(true)
      setShowNodeCard(false)
      return
    }

    if (node.kind !== 'checkpoint') {
      setCurrentQuestionIndex(0)
      setSelectedOption('')
      setSelectedAnswers({})
      setShowNodeCard(true)
    }
  }

  const handleContinueToQuiz = () => {
    setShowVideoModal(false)
    setVideoCompleted(true)
    setCurrentQuestionIndex(0)
    setSelectedOption('')
    setSelectedAnswers({})
    setShowNodeCard(true)
  }

  const completeCurrentNode = () => {
    const completingNodeId = activeMainNodeId
    setQuizAnswered(true)
    setCompletionFlashNodeId(completingNodeId)

    window.setTimeout(() => {
      const nextIndex = Math.min(currentNodeIndex + 1, mainNodeOrder.length - 1)
      const nextNodeId = mainNodeOrder[nextIndex]
      setShowNodeCard(false)
      setSelectedAnswers({})
      setSelectedOption('')
      setCurrentQuestionIndex(0)
      setQuizAnswered(false)
      setCurrentNodeIndex(nextIndex)
      setFocusedNodeId(nextNodeId)
    }, 720)

    window.setTimeout(() => {
      setCompletionFlashNodeId(null)
    }, 1100)
  }

  const handleQuizOptionSelect = (option) => {
    if (quizAnswered) {
      return
    }

    if (selectedOption) {
      return
    }

    const questionIndex = currentQuestionIndex
    setSelectedOption(option)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }))

    window.setTimeout(() => {
      const nextQuestionIndex = questionIndex + 1
      if (nextQuestionIndex >= quizQuestions.length) {
        completeCurrentNode()
        return
      }

      setCurrentQuestionIndex(nextQuestionIndex)
      setSelectedOption('')
    }, 500)
  }

  const renderOnboarding = () => (
    <motion.section
      key="onboarding"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-aurora opacity-70"
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      {orbitBadges.map((badge, index) => (
        <motion.div
          key={badge.label}
          className={`pointer-events-none absolute ${badge.position} hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-xl md:block ${badge.tone}`}
          animate={{ y: [0, -10, 0], rotate: [0, index % 2 === 0 ? 2 : -2, 0] }}
          transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut' }}
        >
          {badge.label}
        </motion.div>
      ))}

      <motion.div
        layout
        className="glass-panel relative z-10 w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 p-6 shadow-premium md:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />

        <div className="relative z-10 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Adaptive setup</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Build your route</h1>
            <p className="mt-3 max-w-md text-sm text-white/50">Every answer tunes your launch loadout and initial mission path.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
            Step {onboardingStep + 1}/{onboardingSteps.length}
          </div>
        </div>

        <div className="relative z-10 mb-8 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-300"
            initial={false}
            animate={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            className="relative z-10"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -34 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <p className="text-sm uppercase tracking-[0.28em] text-indigo-200/80">{activeStep.id}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{activeStep.title}</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">{activeStep.subtitle}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {activeStep.options.map((option) => {
                const isSelected =
                  activeStep.type === 'multi'
                    ? selectedInterests.includes(option)
                    : activeStep.id === 'goal'
                      ? selectedGoal === option
                      : selectedLevel === option

                return (
                  <motion.button
                    key={option}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    animate={isSelected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={{ duration: 0.22 }}
                    onClick={() => handleOptionToggle(activeStep.id, option)}
                    className={`${optionButtonBase} ${
                      isSelected
                        ? 'border-indigo-400/60 bg-indigo-500/20 text-white shadow-glow'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>{option}</span>
                      <span className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-white/30'}`}>
                        {isSelected ? 'Equipped' : 'Add'}
                      </span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 mt-10 flex items-center justify-between">
          <div className="text-sm text-white/45">
            {canContinue ? 'Selections are local and only for demo flow.' : 'Choose an option to continue.'}
          </div>
          <motion.button
            whileHover={canContinue ? { scale: 1.03 } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            onClick={handleContinue}
            disabled={!canContinue}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
              canContinue
                ? 'bg-indigo-500 shadow-glow hover:bg-indigo-400'
                : 'cursor-not-allowed bg-white/10 text-white/35'
            }`}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  )

  const renderCourses = () => (
    <motion.section
      key="courses"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden px-4 py-10 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-50" />

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Course select</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Choose your first expedition</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              Each path is styled like a guided run. Pick one and jump straight into a glowing journey view.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              {selectedGoal || 'Goal'} track • {selectedLevel || 'Level'}
            </div>
            <div className="rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
              Reward chest waiting
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              whileHover={{ y: -10, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleCourseSelect(course)}
              className="glass-panel group relative overflow-hidden rounded-[26px] border border-white/10 p-6 text-left shadow-premium"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${course.accent} opacity-80 transition duration-500 group-hover:opacity-100`} />
              <motion.div
                className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"
                animate={{ x: [0, -12, 0], y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)] opacity-70" />

              <div className="relative">
                <div className="mb-10 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/70">
                  {course.duration}
                </div>
                <h2 className="text-2xl font-semibold text-white">{course.title}</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">{course.description}</p>
                <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-white/45">
                  <span>3 boss nodes</span>
                  <span>•</span>
                  <span>1 checkpoint</span>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-white/60">Enter journey mode</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80 transition group-hover:border-indigo-300/30 group-hover:bg-indigo-400/20">
                    Launch
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  )

  // FIX 3: Replaced the broken bezier formula.
  // Old formula: `C ${midX - 70} ${start.y + bend * direction}, ${midX + 60} ${end.y - bend * direction}`
  // The `bend * direction` multiplier would flip control points when end.y < start.y,
  // creating curves that bowed in the wrong direction.
  //
  // New formula uses horizontal tension (dx * 0.5) to pull control points
  // straight outward from each endpoint — this creates smooth, predictable
  // S-curves regardless of whether the path goes up or down.
  const renderMapConnection = (start, end, colorClass, dashed = false) => {
    const dx = end.x - start.x
    const path = `M ${start.x} ${start.y} C ${start.x + dx * 0.5} ${start.y}, ${end.x - dx * 0.5} ${end.y}, ${end.x} ${end.y}`

    return (
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        className={colorClass}
        strokeDasharray={dashed ? '8 10' : undefined}
      />
    )
  }

  const renderJourney = () => (
    <motion.section
      key="journey"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen overflow-hidden px-6 py-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_42%)]" />
      <motion.div
        aria-hidden
        className="absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ x: [0, 20, -12, 0], y: [0, -12, 16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[18%] right-[10%] h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
        animate={{ x: [0, -18, 8, 0], y: [0, 12, -16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <AnimatePresence>
        {(showVideoModal || showNodeCard) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-10 bg-[#040814]/45 backdrop-blur-[4px]"
          />
        )}
      </AnimatePresence>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-[1400px] flex-col">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentScreen('courses')}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
          >
            Back
          </button>

          <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 shadow-soft backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Level</p>
                <p className="mt-1 text-lg font-semibold text-white">Level {level}</p>
              </div>
              <div className="w-40">
                <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                  <span>XP</span>
                  <span>{xp}/100</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-cyan-300"
                    initial={false}
                    animate={{ width: `${xp}%` }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-center">
                <p className="text-[10px] uppercase tracking-[0.24em] text-amber-100/70">Combo</p>
                <p className="mt-1 text-sm font-semibold text-amber-100">{streak}x</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowSkillTree(true)}
            className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 transition hover:bg-indigo-500/20"
          >
            Skill Tree
          </button>
        </div>

        <div className="glass-panel mt-8 flex-1 overflow-hidden rounded-[30px] border border-white/10 shadow-premium">
          <div className="flex h-full flex-col px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  {usingWebJourney ? webCourse.title : `${selectedCourse?.title ?? webCourse.title} • previewing Web Development map`}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Journey mode active</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/55">
                    {completedCount} nodes cleared
                  </div>
                  <div className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100/75">
                    Energy {energy}%
                  </div>
                </div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
                <p>Web Development region</p>
                <p className="mt-1 text-xs text-white/40">{checkpointDistance} main step to checkpoint</p>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-[1.45fr_0.78fr] gap-6">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_30%),rgba(7,12,24,0.74)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_62%,rgba(79,70,229,0.16),transparent_20%),radial-gradient(circle_at_55%_78%,rgba(34,211,238,0.08),transparent_18%),radial-gradient(circle_at_88%_24%,rgba(245,158,11,0.12),transparent_18%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] opacity-50" />
                <div className="absolute left-6 top-6 z-10 flex items-center gap-3">
                  <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/55">
                    Region 01
                  </div>
                  <div className="rounded-full border border-indigo-300/15 bg-indigo-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-indigo-100/70">
                    Click active node to enter
                  </div>
                </div>

                <div className="absolute inset-x-0 top-6 z-10 flex justify-center">
                  <div className="h-1 w-72 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="relative h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-300 to-amber-300"
                      initial={false}
                      animate={{ width: `${journeyProgress}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                      <span className="absolute inset-y-0 left-0 w-20 bg-white/35 blur-md animate-shimmer" />
                    </motion.div>
                  </div>
                </div>

                {/* FIX 4: Changed min-h from 520px to 560px to give vertical
                    breathing room for the Mini Quest label at y=430 + label
                    offset (~55px) = ~485px, so 560px keeps it comfortably
                    inside the container. */}
                <motion.div
                  className="relative z-10 min-h-[560px] w-full"
                  initial={false}
                  animate={{
                    x: showVideoModal || showNodeCard ? -28 : 0,
                    y: showVideoModal || showNodeCard ? 6 : 0,
                    scale: showVideoModal || showNodeCard ? 1.03 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1 }}
                >
                  {/* SVG connections — uses the fixed renderMapConnection above */}
                  <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                    {renderMapConnection(
                      webJourneyNodes[0], // HTML Basics (90, 300)
                      webJourneyNodes[2], // Tags      (290, 140)
                      currentNodeIndex > 0
                        ? 'text-emerald-300/80 drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]'
                        : 'text-indigo-300/55 drop-shadow-[0_0_12px_rgba(99,102,241,0.28)]',
                    )}
                    {renderMapConnection(
                      webJourneyNodes[2], // Tags  (290, 140)
                      webJourneyNodes[3], // Forms (530, 300)
                      currentNodeIndex > 1
                        ? 'text-emerald-300/80 drop-shadow-[0_0_12px_rgba(34,197,94,0.35)]'
                        : 'text-indigo-300/55 drop-shadow-[0_0_12px_rgba(99,102,241,0.28)]',
                    )}
                    {renderMapConnection(
                      webJourneyNodes[3], // Forms      (530, 300)
                      webJourneyNodes[4], // Checkpoint (750, 140)
                      currentNodeIndex > 2
                        ? 'text-amber-300/65 drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                        : 'text-amber-300/40 drop-shadow-[0_0_12px_rgba(245,158,11,0.18)]',
                    )}
                    {renderMapConnection(
                      webJourneyNodes[2], // Tags      (290, 140)
                      webJourneyNodes[1], // Mini Quest (370, 430)
                      'text-cyan-300/55 drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]',
                      true, // dashed
                    )}
                  </svg>

                  {webJourneyNodes.map((node) => {
                    const nodeIndex = mainNodeOrder.indexOf(node.id)
                    const isCompleted = nodeIndex >= 0 ? nodeIndex < currentNodeIndex : false
                    const isCurrent = nodeIndex === currentNodeIndex
                    const isCheckpoint = node.kind === 'checkpoint'
                    const isSide = node.kind === 'side'
                    const isFocused = focusedNodeIdSafe === node.id
                    const nodeSize = isCheckpoint ? 70 : isSide ? 40 : 50

                    return (
                      <div
                        key={node.id}
                        className="absolute z-20"
                        style={{ left: node.x, top: node.y }}
                      >
                        <motion.button
                          whileHover={isCurrent || isSide ? { scale: 1.08, y: -4 } : {}}
                          whileTap={isCurrent || isSide ? { scale: 0.97 } : {}}
                          animate={
                            isCurrent
                              ? {
                                  scale: [1, 1.1, 1],
                                  boxShadow: ['0 0 0 rgba(79,70,229,0)', '0 0 32px rgba(99,102,241,0.85)', '0 0 0 rgba(79,70,229,0)'],
                                }
                              : completionFlashNodeId === node.id
                                ? {
                                    scale: [1, 1.12, 1],
                                    boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 34px rgba(34,197,94,0.88)', '0 0 0 rgba(34,197,94,0)'],
                                  }
                                : { scale: 1 }
                          }
                          transition={{
                            duration: isCurrent ? 2 : 0.8,
                            repeat: isCurrent ? Infinity : 0,
                            ease: 'easeInOut',
                          }}
                          onClick={() => (isCurrent || isSide) && handleNodeFocus({ ...node, kind: node.kind, description: node.description })}
                          className={`relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition ${
                            isCheckpoint
                              ? 'border-amber-300/50 bg-amber-400/20 text-amber-100 shadow-gold'
                              : isSide
                                ? 'border-cyan-300/40 bg-cyan-400/15 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.22)]'
                              : isCompleted
                                ? 'border-emerald-400/50 bg-emerald-500/20 text-white shadow-success'
                                : isCurrent
                                  ? 'border-indigo-300/60 bg-indigo-500/20 text-white shadow-glow'
                                  : 'border-white/10 bg-[#131a2b] text-white/45'
                          } ${isFocused ? 'ring-2 ring-white/20' : ''}`}
                          style={{ width: nodeSize, height: nodeSize }}
                        >
                          {!isCheckpoint && (
                            <span className="pointer-events-none absolute inset-1 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_60%)]" />
                          )}
                          <span className={isCheckpoint ? 'text-xl' : 'text-lg'}>
                            {isCheckpoint ? '★' : isSide ? '◌' : isCompleted ? '✓' : isCurrent ? '●' : '?'}
                          </span>
                          {isCurrent && (
                            <motion.span
                              className="absolute inset-0 rounded-full border border-indigo-300/25"
                              animate={{ scale: [1, 1.4], opacity: [0.55, 0] }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                            />
                          )}
                        </motion.button>

                        {/* FIX 5: Replaced fixed w-40 label with max-w-[8rem] and
                            added overflow-hidden + truncate so labels on right-side
                            nodes (Checkpoint at x=750) don't bleed out of the panel. */}
                        <div className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] max-w-[8rem] -translate-x-1/2 text-center">
                          <div className="inline-flex max-w-full rounded-full border border-white/10 bg-black/25 px-3 py-1 backdrop-blur-sm">
                            <p className="truncate text-sm font-medium text-white">{node.title}</p>
                          </div>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/40">
                            {isCheckpoint ? 'Milestone' : isSide ? 'Side Quest' : isCompleted ? 'Completed' : isCurrent ? 'Active' : 'Locked'}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="glass-panel rounded-[28px] border border-white/10 p-5 shadow-premium">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Mission panel</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{focusedNode.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{focusedNode.description}</p>
                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Focus state</p>
                    <p className="mt-1 text-sm text-white/75">
                      {isNodeCurrent(focusedNode.id)
                        ? focusedNode.id === 1
                          ? 'Primary lesson ready. Click to enter fullscreen intro.'
                          : focusedNode.kind === 'checkpoint'
                            ? 'Checkpoint is ahead. Complete the route to unlock it.'
                            : 'This node is active and ready for the next quiz.'
                        : isNodeCompleted(focusedNode.id)
                          ? 'Cleared successfully. Rewards banked.'
                          : isNodeUnlocked(focusedNode.id)
                            ? 'Unlocked side branch. Explore for atmosphere.'
                            : 'Locked until the main route moves forward.'}
                    </p>
                  </div>
                </div>

                <div className="glass-panel rounded-[28px] border border-white/10 p-5 shadow-premium">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Region rewards</p>
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-emerald-100/60">Current objective</p>
                      <p className="mt-1 text-sm font-medium text-white">{progressLabel}</p>
                    </div>
                    <div className="rounded-2xl border border-indigo-300/15 bg-indigo-500/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-100/60">Unlocked reward</p>
                      <p className="mt-1 text-sm font-medium text-white">Starter badge • +24 XP • combo gain</p>
                    </div>
                    <div className="rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-amber-100/60">Checkpoint reward</p>
                      <p className="mt-1 text-sm font-medium text-white">Web Core chest • next region access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-[#030712]/92 px-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="w-full max-w-6xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Node intro</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">HTML Basics</h3>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="glass-panel overflow-hidden rounded-[30px] border border-white/10 p-6 shadow-premium">
                <video controls autoPlay className="mx-auto block w-[80%] rounded-[22px] border border-white/10 bg-black">
                  <source src="/videos/intoduction to HTML.mp4" type="video/mp4" />
                </video>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-white/55">Watch the intro, then jump into the quick check.</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleContinueToQuiz}
                    className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-glow"
                  >
                    Continue to Quiz
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNodeCard && activeNode.kind !== 'checkpoint' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-transparent px-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="glass-panel w-full max-w-2xl rounded-[28px] border border-white/10 p-6 shadow-premium"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Quick Check</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{activeNode.title}</h3>
                </div>
                <button
                  onClick={() => !quizAnswered && setShowNodeCard(false)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/60 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                <p className="text-lg font-semibold text-white">Quick Check</p>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/40">
                  <span>Question {currentQuestionIndex + 1}/{quizQuestions.length}</span>
                  <span>{quizAnswered ? 'Complete' : selectedOption ? 'Advancing...' : 'Tap an answer'}</span>
                </div>
                <div className="mt-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                    >
                      <p className="mb-3 text-sm font-medium text-white">{quizQuestions[currentQuestionIndex].prompt}</p>
                      <div className="grid gap-2">
                        {quizQuestions[currentQuestionIndex].options.map((option) => {
                          const isSelected = selectedOption === option
                          return (
                            <motion.button
                              key={option}
                              whileHover={!selectedOption ? { scale: 1.01 } : {}}
                              whileTap={!selectedOption ? { scale: 0.98 } : {}}
                              animate={isSelected ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                              transition={{ duration: 0.2 }}
                              disabled={Boolean(selectedOption)}
                              onClick={() => handleQuizOptionSelect(option)}
                              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                isSelected
                                  ? 'border-emerald-400/60 bg-emerald-500/20 text-white'
                                  : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10'
                              } ${selectedOption && !isSelected ? 'cursor-not-allowed opacity-60' : ''}`}
                            >
                              {option}
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-sm text-white/55">
                  {quizAnswered
                    ? 'Advancing through the map...'
                    : selectedOption
                      ? 'Correct. Loading the next question...'
                      : 'Choose an answer to continue automatically.'}
                </p>
                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100/80">
                  Auto-progress
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quizAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: -26, scale: 1 }}
            exit={{ opacity: 0, y: -52, scale: 0.88 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute right-10 top-24 z-20 rounded-full border border-emerald-300/20 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-success"
          >
            +24 XP
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkillTree && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 px-6 py-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              className="glass-panel relative h-[92vh] w-[94vw] max-w-none overflow-hidden rounded-[24px] border border-white/10 p-6 shadow-premium"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_24%)]" />
              <div className="relative z-10 mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Skill Tree</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Skill Tree — Your Learning Graph</h3>
                </div>
                <button
                  onClick={() => setShowSkillTree(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-lg text-white/65 transition hover:bg-white/10"
                  aria-label="Close skill tree"
                >
                  ×
                </button>
              </div>

              <div className="relative z-10 grid h-[calc(92vh-110px)] grid-cols-[1.4fr_0.72fr] gap-6">
                <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.1),transparent_22%),rgba(255,255,255,0.03)]">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:54px_54px] opacity-35" />
                  <motion.div
                    className="absolute inset-0 scale-[1.06]"
                    drag
                    dragElastic={0.08}
                    dragConstraints={{ left: -40, right: 40, top: -30, bottom: 30 }}
                  >
                    <svg className="pointer-events-none absolute inset-0 h-full w-full">
                      <path d="M 50% 16% C 43% 20%, 33% 28%, 24% 36%" stroke="rgba(148,163,184,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 50% 16% C 50% 20%, 50% 30%, 50% 42%" stroke="rgba(148,163,184,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 50% 16% C 58% 20%, 66% 28%, 76% 36%" stroke="rgba(148,163,184,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 24% 36% C 20% 45%, 17% 57%, 14% 70%" stroke="rgba(99,102,241,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 24% 36% C 28% 46%, 31% 59%, 34% 76%" stroke="rgba(99,102,241,0.45)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 50% 42% C 50% 50%, 50% 62%, 50% 74%" stroke="rgba(34,211,238,0.32)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 76% 36% C 76% 46%, 76% 58%, 76% 72%" stroke="rgba(96,165,250,0.32)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <path d="M 24% 36% C 34% 34%, 42% 36%, 50% 42%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="5 8" />
                      <path d="M 50% 42% C 60% 40%, 68% 36%, 76% 36%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="5 8" />
                      <path d="M 34% 76% C 42% 78%, 46% 77%, 50% 74%" stroke="rgba(34,211,238,0.18)" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 7" />
                    </svg>

                    {skillGraphNodes.map((node, index) => {
                      const isSelected = selectedSkillNode === node.id
                      const isCompletedSkill =
                        (node.id === 'html' && currentNodeIndex > 0) ||
                        (node.id === 'tags' && currentNodeIndex > 1) ||
                        (node.id === 'forms' && currentNodeIndex > 2)

                      return (
                        <motion.button
                          key={node.id}
                          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 4.2 + index * 0.45, repeat: Infinity, ease: 'easeInOut' }}
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedSkillNode(node.id)}
                        >
                          <div
                            className={`flex min-w-[92px] items-center justify-center rounded-[22px] border px-4 py-3 text-sm font-semibold transition ${
                              isCompletedSkill
                                ? 'border-emerald-400/40 bg-emerald-500/20 text-white shadow-success'
                                : node.state === 'core'
                                  ? 'border-indigo-300/50 bg-indigo-500/20 text-white shadow-glow'
                                  : node.state === 'active'
                                    ? 'border-cyan-300/50 bg-cyan-400/15 text-cyan-50 shadow-glow'
                                    : node.state === 'child'
                                      ? 'border-white/15 bg-white/8 text-white/75'
                                      : 'border-white/10 bg-white/5 text-white/45'
                            } ${isSelected ? 'ring-2 ring-white/25 shadow-[0_0_32px_rgba(255,255,255,0.1)]' : ''}`}
                          >
                            {node.short}
                          </div>
                          <p className="mt-3 text-sm font-medium text-white">{node.label}</p>
                        </motion.button>
                      )
                    })}
                  </motion.div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Selected skill</p>
                    <h4 className="mt-3 text-3xl font-semibold text-white">
                      {skillGraphNodes.find((node) => node.id === selectedSkillNode)?.label ?? 'HTML'}
                    </h4>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      {skillGraphNodes.find((node) => node.id === selectedSkillNode)?.description ??
                        'The graph highlights the main Web Dev trunk and the HTML branch.'}
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Core track</p>
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      Web Development branches into HTML, CSS, and JavaScript, with HTML currently unlocking Tags and Forms as your live progression path.
                    </p>
                  </div>

                  <div className="rounded-[26px] border border-indigo-300/15 bg-indigo-500/10 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-indigo-100/60">Interaction</p>
                    <p className="mt-3 text-sm leading-6 text-white/75">
                      Hover nodes to amplify glow. Click any node to inspect it. You can also drag the graph slightly for a more immersive view.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )

  return (
    <div className="min-h-screen bg-night text-white">
      <AnimatePresence mode="wait">
        {currentScreen === 'onboarding' && renderOnboarding()}
        {currentScreen === 'courses' && renderCourses()}
        {currentScreen === 'journey' && renderJourney()}
      </AnimatePresence>
    </div>
  )
}

export default App
