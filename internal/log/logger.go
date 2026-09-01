package log

import (
	"os"
	"time"

	"github.com/rs/zerolog"
)

// Logger is the package-level zerolog logger configured for the application.
var Logger = zerolog.New(zerolog.ConsoleWriter{
	Out:        os.Stdout,
	TimeFormat: time.RFC3339,
}).
	Level(zerolog.DebugLevel).
	With().
	Timestamp().
	Caller().
	Logger()

// SetLevel adjusts the log level at runtime.
func SetLevel(level zerolog.Level) {
	Logger = Logger.Level(level)
}
