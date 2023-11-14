-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db` DEFAULT CHARACTER SET utf8mb3 ;
USE `db` ;

-- -----------------------------------------------------
-- Table `db`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`User` (
  `user_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `email_preference` BIT(1) NOT NULL DEFAULT 1,
  `darkmode_preference` BIT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`Course`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Course` (
  `course_id` INT NOT NULL,
  `course_name` VARCHAR(100) NOT NULL,
  `course_code` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`course_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`Assignment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Assignment` (
  `assignment_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `assignment_name` VARCHAR(45) NOT NULL,
  `assignment_type` VARCHAR(45) NOT NULL,
  `assignment_weightage` INT NULL DEFAULT NULL,
  `start_date` DATETIME NULL DEFAULT NULL,
  `due_date` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  INDEX `fk_assignments_course (subject)1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_assignment_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `db`.`Course` (`course_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`Case`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Case` (
  `case_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`case_id`),
  INDEX `fk_case_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_case_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `db`.`User` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`Thread`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Thread` (
  `thread_id` INT NOT NULL AUTO_INCREMENT,
  `case_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `request_type` VARCHAR(8) NOT NULL,
  `complex_case` BIT(1) NOT NULL,
  `current_status` VARCHAR(8) NOT NULL DEFAULT 'Pending',
  `assignment_id` INT NULL,
  `date_updated` DATE NOT NULL,
  PRIMARY KEY (`thread_id`),
  INDEX `fk_thread_case1_idx` (`assignment_id` ASC) VISIBLE,
  INDEX `fk_thread_case2_idx` (`case_id` ASC) VISIBLE,
  INDEX `fk_Thread_Course1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_thread_assignment`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `db`.`Assignment` (`assignment_id`),
  CONSTRAINT `fk_thread_case`
    FOREIGN KEY (`case_id`)
    REFERENCES `db`.`Case` (`case_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_thread_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `db`.`Course` (`course_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;



-- -----------------------------------------------------
-- Table `db`.`Request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Request` (
  `request_id` INT NOT NULL AUTO_INCREMENT,
  `thread_id` INT NOT NULL,
  `request_content` VARCHAR(1000) NOT NULL,
  `instructor_notes` VARCHAR(1000) NULL,
  `date_created` DATE,
  PRIMARY KEY (`request_id`),
  INDEX `fk_thread_idx` (`thread_id` ASC) VISIBLE,
  CONSTRAINT `fk_request_thread`
    FOREIGN KEY (`thread_id`)
    REFERENCES `db`.`Thread` (`thread_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;



-- -----------------------------------------------------
-- Table `db`.`File`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`File` (
  `file_id` INT NOT NULL AUTO_INCREMENT,
  `file` LONGBLOB NOT NULL,
  `file_name` VARCHAR(45) NOT NULL,
  `file_type` VARCHAR(18) NOT NULL COMMENT 'aap or supportingDocument',
  `user_id` INT NULL DEFAULT NULL,
  `request_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`file_id`),
  INDEX `fk_aap_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `meow_idx` (`request_id` ASC) VISIBLE,
  CONSTRAINT `fk_file_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `db`.`User` (`user_id`),
  CONSTRAINT `fk_file_request`
    FOREIGN KEY (`request_id`)
    REFERENCES `db`.`Request` (`request_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`Enrollment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`Enrollment` (
  `enrollment_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `enrollment_role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`enrollment_id`),
  INDEX `fk_Course (subject)_has_users_users1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_Course (subject)_has_users_Course (subject)1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_enrollment_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `db`.`Course` (`course_id`),
  CONSTRAINT `fk_enrollment_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `db`.`User` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`CoursePreferences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`CoursePreferences` (
  `coursepreference_id` INT NOT NULL AUTO_INCREMENT,
  `course_id` INT NOT NULL,
  `global_extension_length` INT NOT NULL DEFAULT 3,
  `general_tutor` BIT(1) NOT NULL DEFAULT 1,
  `extension_tutor` BIT(1) NOT NULL DEFAULT 1,
  `quiz_tutor` BIT(1) NOT NULL DEFAULT 1,
  `remark_tutor` BIT(1) NOT NULL DEFAULT 1,
  `other_tutor` BIT(1) NOT NULL DEFAULT 1,
  `general_scoord` BIT(1) NOT NULL DEFAULT 1,
  `extension_scoord` BIT(1) NOT NULL DEFAULT 1,
  `quiz_scoord` BIT(1) NOT NULL DEFAULT 1,
  `remark_scoord` BIT(1) NOT NULL DEFAULT 1,
  `other_scoord` BIT(1) NOT NULL DEFAULT 1,
  `general_reject` VARCHAR(1000) NULL DEFAULT NULL,
  `extension_approve` VARCHAR(1000) NULL DEFAULT NULL,
  `extension_reject` VARCHAR(1000) NULL DEFAULT NULL,
  `quiz_approve` VARCHAR(1000) NULL DEFAULT NULL,
  `quiz_reject` VARCHAR(1000) NULL DEFAULT NULL,
  `remark_approve` VARCHAR(1000) NULL DEFAULT NULL,
  `remark_reject` VARCHAR(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`coursepreference_id`),
  INDEX `fk_settings_course (subject)1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_coursepreferences_course`
    FOREIGN KEY (`course_id`)
    REFERENCES `db`.`Course` (`course_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `db`.`AssignmentExtensionLength`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db`.`AssignmentExtensionLength` (
  `coursepreference_id` INT NOT NULL,
  `assignment_id` INT NOT NULL,
  `extension_length` INT NOT NULL,
  PRIMARY KEY (`assignment_id`),
  INDEX `fk_AssignmentExtensionLength_CoursePreferences1_idx` (`coursepreference_id` ASC) VISIBLE,
  CONSTRAINT `fk_assignmentlength_assignment`
    FOREIGN KEY (`assignment_id`)
    REFERENCES `db`.`Assignment` (`assignment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_assignmentlength_coursepreferences`
    FOREIGN KEY (`coursepreference_id`)
    REFERENCES `db`.`CoursePreferences` (`coursepreference_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
